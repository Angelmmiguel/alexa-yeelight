// Load styles
require('./stylesheets/main.sass')

// Imports
import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

// Containers
import AppContainer from './containers/AppContainer';

ReactDOM.render(
  <Router history={ browserHistory }>
    <Route path="/" component={ AppContainer }>
    </Route>
  </Router>,
  document.getElementById('content'));
