import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import App from './pages/App';
import HomePage from './pages/HomePage';
import ExamplePage from './pages/ExamplePage';
import NotFoundPage from './pages/NotFoundPage';

const router = () => (
  <ConnectedRouter history={browserHistory} >
    <div>
      <Route component={App} />
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route exact path="/example" component={ExamplePage} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </ConnectedRouter>
);

export default router;
