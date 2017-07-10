import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';

const PublicRoutes = () => (
  <Switch>
    <Route exact path="/" component={WelcomePage} />
    <Route exact path="/about" component={AboutPage} />
    <Route component={NotFoundPage} />
  </Switch>
);

export default PublicRoutes;
