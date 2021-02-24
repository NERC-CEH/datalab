import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import configureStore from './store/configureStore';
import theme from './theme';
import Router from './router';
import { initialiseAuth } from './config/auth';
import { initialiseVersion } from './config/version';

async function createApplication() {
  const store = configureStore();
  await Promise.all([
    initialiseVersion(),
    initialiseAuth(),
  ]);

  ReactDOM.render(
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <Router />
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('root'),
  );
}

createApplication();
