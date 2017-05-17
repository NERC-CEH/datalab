import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import configureStore from './store/configureStore';
import Router from './router';

const store = configureStore();

// Needed for onTouchTap -- will be fixed in future react release
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <Router />
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root'),
);
