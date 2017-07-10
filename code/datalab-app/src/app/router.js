import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import CallbackPage from './pages/CallbackPage';
import RequireAuth from './components/app/RequireAuth';
import PublicRoutes from './PublicRoutes';
import PrivateRoutes from './PrivateRoutes';

const router = () => (
  <ConnectedRouter history={browserHistory}>
    <Switch>
      <Route exact path="/callback" component={CallbackPage} />
      <RequireAuth path="/" PublicComponent={PublicRoutes} PrivateComponent={PrivateRoutes} />
    </Switch>
  </ConnectedRouter>
);
export default router;
