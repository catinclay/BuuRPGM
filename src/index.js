/* global __BASENAME__ */
/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import logger from 'redux-logger';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import reducer from './reducers';
import Root from './rootContainer';

const store = createStore(reducer, applyMiddleware(logger));

ReactDOM.render(
  <Provider store={store}>
    <Router basename={__BASENAME__}>
      <Route path="/:filter?" component={Root} />
    </Router>
  </Provider>,
  document.getElementById('root')
);
