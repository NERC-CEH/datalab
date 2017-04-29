import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import injectTapEventPlugin from 'react-tap-event-plugin';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import App from './pages/App';
import NotFoundPage from './pages/NotFoundPage';

const store = configureStore();

// Needed for onTouchTap -- will be fixed in future react release
injectTapEventPlugin();

ReactDOM.render(
  <MuiThemeProvider>
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={App} />
          <Route component={NotFoundPage} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('root')
);
