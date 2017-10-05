import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { MuiThemeProvider, createMuiTheme } from 'material-ui';
import configureStore from './store/configureStore';
import Router from './router';

const store = configureStore();

const theme = createMuiTheme({
  palette: {},
});

ReactDOM.render(
  <Provider store={store}>
    <MuiThemeProvider theme={theme}>
      <Router />
    </MuiThemeProvider>
  </Provider>,
  document.getElementById('root'),
);
