import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import configureStore from './store/configureStore';
import theme from './theme';
import Router from './router';
import { initialiseAuth } from './config/auth';
import { initialiseCatalogue } from './config/catalogue';
import { initialiseImages } from './config/images';
import { initialiseStorage } from './config/storage';
import { initialiseVersion } from './config/version';

async function createApplication() {
  const store = configureStore();
  await Promise.all([
    initialiseAuth(),
    initialiseCatalogue(),
    initialiseImages(),
    initialiseStorage(),
    initialiseVersion(),
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
