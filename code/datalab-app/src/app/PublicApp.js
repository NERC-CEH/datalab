import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import NotFoundPage from './pages/NotFoundPage';

const PublicApp = () => (
  <Switch>
    <Route exact path="/" component={WelcomePage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default PublicApp;
