import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import Router from './router';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
      <Router />
  </Provider>,
  document.getElementById('root'),
);
