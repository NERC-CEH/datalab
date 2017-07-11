import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import CallbackPage from './pages/CallbackPage';
import RequireAuth from './components/app/RequireAuth';
import PublicApp from './PublicApp';
import PrivateApp from './PrivateApp';

const router = () => (
  <ConnectedRouter history={browserHistory}>
    <Switch>
      <Route exact path="/callback" component={CallbackPage} />
      <RequireAuth path="/" PublicComponent={PublicApp} PrivateComponent={PrivateApp} />
    </Switch>
  </ConnectedRouter>
);
export default router;
