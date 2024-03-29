import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ThemeProvider as MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import configureStore from './store/configureStore';
import theme from './theme';
import Router from './router';
import { initialiseAuth } from './config/auth';
import { initialiseCatalogue } from './config/catalogue';
import { initialiseImages } from './config/images';
import { initialiseStorage } from './config/storage';
import { initialiseVersion } from './config/version';
import { initialiseClusters } from './config/clusters';
import { initialiseFeatureFlags } from './config/featureFlags';

async function createApplication() {
  const store = configureStore();
  await Promise.all([
    initialiseAuth(),
    initialiseFeatureFlags(),
    initialiseCatalogue(),
    initialiseImages(),
    initialiseStorage(),
    initialiseVersion(),
    initialiseClusters(),
  ]);

  ReactDOM.render(
    <Provider store={store}>
      <StyledEngineProvider injectFirst>
        <MuiThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Router />
          </LocalizationProvider>
        </MuiThemeProvider>
      </StyledEngineProvider>
    </Provider>,
    document.getElementById('root'),
  );
}

createApplication();
