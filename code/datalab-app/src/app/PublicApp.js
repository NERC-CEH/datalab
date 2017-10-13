import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider } from 'material-ui';
import { publicAppTheme } from './theme';
import WelcomePage from './pages/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';

const PublicApp = () => (
  <MuiThemeProvider theme={publicAppTheme}>
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route component={NotFoundPage} />
    </Switch>
  </MuiThemeProvider>
);

export default PublicApp;
