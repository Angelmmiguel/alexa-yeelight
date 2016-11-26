// Main
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { loadDatabase } from './db';
import ON_DEATH from 'death';
import SocketIO from 'socket.io';
// Import Alexa
import alexaClient from './app/alexa';
import alexaVerifier from 'alexa-verifier';
// Yeelight library
import Yeelight from './app/yeelight';

// Environment
const isDev = process.env.NODE_ENV !== 'production';

// Webpack is only for development
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
const webpackConfig = require('./webpack.config.js');
var middleware;

// Database!
const db = loadDatabase();

// Port and main config
const port = isDev ? 3000 : process.env.PORT;
const app = express();
const server = app.listen(port);
app.use(logger(isDev ? 'dev' : 'prod'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize app
const io = SocketIO(server);
const sockets = new Map();
const yeelight = new Yeelight();

// Socket IO!
io.on('connection', (socket) => {
  sockets.set(socket.id, socket);
  // Discover
  yeelight.discover();

  socket.on('disconnect', (socket) => {
    sockets.delete(socket.id);
  })
});

io.on('disconnect', (socket) => {
  console.log('Global disconnect');
});

const updateBulb = (bulb) => {
  console.log('Updating bulb');
  console.log(bulb);

  db.bulbs.update({ id: bulb.id }, { $set: { ...bulb } }, (err, num) => {
    if (!err) {
      for (let [id, socket] in sockets) {
        socket.emit('updated', bulb);
      }
    } else {
      console.log(`ERROR on update: ${err}`);
    }
  });
}

const createBulb = (bulb) => {
  // New Bulb
  console.log('Creating bulb');
  bulb.alexaName = 'Non defined';
  bulb.initialized = false;

  db.bulbs.insert(bulb, (err, newBulb) => {
    if (!err) {
      for (let [id, socket] in sockets) {
        socket.emit('discovered', newBulb)
      }
    } else {
      console.log(`ERROR on discover: ${err}`);
    }
  });
}

yeelight.on('bulb', (bulb) => {
  // Store the bulb
  db.bulbs.findOne({ id: bulb.id }).projection({ id: 1 }).exec((err, doc) => {
    if (doc) {
      updateBulb(bulb);
    } else if (!err) {
      createBulb(bulb);
    } else {
      console.log(err);
    }
  });
});

// Update bulbs every 10s
let polling = setInterval(() => {
  //yeelight.discover();
}, 10000);

if (isDev) {
  const compiler = webpack(webpackConfig);
  middleware = webpackMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    contentBase: 'src',
    stats: {
      colors: true,
      hash: false,
      timings: true,
      chunks: false,
      chunkModules: false,
      modules: false
    }
  });
  // Disable cache
  app.set('etag', false);
  // Include the middleware
  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
} else {
  // Production!
  app.use(express.static(__dirname + '/dist'));
}

// Routes
app.get('/hello', (req, res) => {
  res.send('Hello World!');
});

// Alexa route!
app.post('/alexa', (req, res) => {
  let certUrl = req.headers.signaturecertchainurl,
    signature = req.headers.signature;

  // Validate the request
  alexaVerifier(certUrl, signature, re.body, err => {
    if (err) {
      console.error('Error validating the alexa cert:', err);
      res.status(401).json({ status: 'failure', reason: err });
    } else {
      // Send to alexa app
      alexaClient.request(req.body)
        .then(alexaRes => {
          res.json(alexaRes);
        });
    }
  });
});

// Get bulbs
app.get('/api/bulbs', (req, res) => {
  // Retrieve all bulbs
  db.bulbs.find({}, (err, docs) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: err }).end();
    } else {
      res.json({ items: docs }).end();
    }
  })
});

// Fallback routes
if (isDev) {
  app.get('*', (req, res) => {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

server.on('listening', () => {
  console.log('Alexa Yeelight is listening on 3000!');
});

// Cleanup the application (Watchers...)
ON_DEATH(() => {
  console.log('Finishing...');
  clearInterval(polling);
  process.exit(0);
})
