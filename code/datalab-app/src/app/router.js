import React from 'react';
import { ConnectedRouter } from 'react-router-redux';
import { Route, Switch } from 'react-router-dom';
import browserHistory from './store/browserHistory';
import App from './pages/App';
import HomePage from './pages/HomePage';
import ExamplePage from './pages/ExamplePage';
import ApiExamplePage from './pages/ApiExamplePage';
import NotFoundPage from './pages/NotFoundPage';
import Auth from './auth/Auth';
import CallbackPage from './pages/CallbackPage';

const auth = new Auth();

const router = () => (
  <ConnectedRouter history={browserHistory} >
    <div>
      <Route component={App} />
      <Switch>
        <Route exact path="/" render={props => <HomePage auth={auth} {...props} />} />
        <Route exact path="/example" component={ExamplePage} />
        <Route exact path="/apiExample" component={ApiExamplePage} />
        <Route exact path="/callback" render={(props) => {
          handleAuthentication(props);
          return <CallbackPage {...props} />;
        }} />
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </ConnectedRouter>
);

function handleAuthentication(nextState, replace) {
  if (/access_token|id_token|error/.test(nextState.location.hash)) {
    auth.handleAuthentication(nextState.location.hash);
  }
}

export default router;
