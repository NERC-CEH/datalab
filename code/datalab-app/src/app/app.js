import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Container } from 'semantic-ui-react';
import configureStore from './store/configureStore';
import Router from './router';

const store = configureStore();

ReactDOM.render(
  <Container>
    <Provider store={store}>
      <Router />
    </Provider>
  </Container>,
  document.getElementById('root'),
);
