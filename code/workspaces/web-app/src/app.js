import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import configureStore from './store/configureStore';
import theme from './theme';
import Router from './router';
import { initialiseAuth } from './auth/auth';
import getAuthConfig from './auth/authConfig';
import { initialiseVersion } from './version';

async function createApplication() {
  const store = configureStore();
  await initialiseVersion();
  const authConfig = await getAuthConfig();
  initialiseAuth(authConfig);

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
