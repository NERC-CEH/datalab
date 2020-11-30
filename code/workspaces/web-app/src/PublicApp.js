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
      <Route exact path="/">
        <WelcomePage />
      </Route>
      <Route exact path="/verify">
        <VerifyEmailPage />
      </Route>
      <Route>
        <RedirectToLoginPage />
      </Route>
    </Switch>
  </MuiThemeProvider>
);

export default PublicApp;
