import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import { publicAppTheme } from './theme';
import WelcomePage from './pages/WelcomePage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import RedirectToLoginPage from './pages/RedirectToLoginPage';

const PublicApp = () => (
  <MuiThemeProvider theme={publicAppTheme}>
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/verify" component={VerifyEmailPage} />
      <Route component={RedirectToLoginPage} />
    </Switch>
  </MuiThemeProvider>
);

export default PublicApp;
