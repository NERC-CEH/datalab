import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import PrivatePage from './pages/PrivatePage';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';

const PrivateApp = () => (
  <div>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/private" component={PrivatePage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
  </div>
);

export default PrivateApp;
