import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import WelcomePage from './pages/WelcomePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import CallbackPage from './pages/CallbackPage';
import RequireAuth from './components/app/RequireAuth';
import HomePage from './pages/HomePage';

const router = () => (
  <ConnectedRouter history={browserHistory}>
    <Switch>
      <RequireAuth exact path="/" PublicComponent={WelcomePage} PrivateComponent={HomePage} />
      <RequireAuth exact path="/private" PrivateComponent={HomePage} />
      <Route exact path="/about" component={AboutPage} />
      <Route exact path="/callback" component={CallbackPage} />
      <Route component={NotFoundPage} />
    </Switch>
  </ConnectedRouter>
);

export default router;
