// Main
import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import logger from 'morgan';
import { loadDatabase } from './db';
import ON_DEATH from 'death';
// Import Alexa
import alexaClient from './alexa';
import alexaVerifier from 'alexa-verifier';

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
app.use(logger(isDev ? 'dev' : 'prod'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
})

// Fallback routes
if (isDev) {
  app.get('*', function response(req, res) {
    res.write(middleware.fileSystem.readFileSync(path.join(__dirname, 'dist/index.html')));
    res.end();
  });
} else {
  app.get('*', function response(req, res) {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
  });
}

app.listen(3000, () => {
  console.log('Alexa Yeelight is listening on 3000!');
});

// Cleanup the application (Watchers...)
ON_DEATH(() => {
  console.log('Finishing...');
  process.exit(0);
})
