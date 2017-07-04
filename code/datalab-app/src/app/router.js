import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import RequireAuth from './components/app/RequireAuth';
import App from './pages/App';
import HomePage from './pages/HomePage';
import ExamplePage from './pages/ExamplePage';
import ApiExamplePage from './pages/ApiExamplePage';
import NotFoundPage from './pages/NotFoundPage';
import CallbackPage from './pages/CallbackPage';
import PrivatePage from './pages/PrivatePage';

const router = () => (
  <ConnectedRouter history={browserHistory} >
    <div>
      <App>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/callback" component={CallbackPage} />
        <Route exact path="/example" component={ExamplePage} />
        <Route exact path="/apiExample" component={ApiExamplePage} />
        <RequireAuth exact path="/private" component={PrivatePage} />
        <Route component={NotFoundPage} />
      </Switch>
      </App>
    </div>
  </ConnectedRouter>
);

export default router;
