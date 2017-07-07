import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CallbackPage from './pages/CallbackPage';

const router = () => (
  <ConnectedRouter history={browserHistory} >
    <Switch>
      <Route exact path="/" component={WelcomePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/callback" component={CallbackPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </ConnectedRouter>
);

export default router;
