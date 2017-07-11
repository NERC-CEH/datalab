import React from 'react';
import { Route, Switch } from 'react-router-dom';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';

const PublicApp = () => (
  <div>
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
  </div>
);

export default PublicApp;
