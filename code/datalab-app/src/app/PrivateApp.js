import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/app/Navigation';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';
import HomePage from './pages/HomePage';
import PrivatePage from './pages/PrivatePage';

const PrivateApp = () => (
  <Navigation>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/private" component={PrivatePage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
  </Navigation>
);

export default PrivateApp;
