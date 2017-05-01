import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './pages/App';
import NotFoundPage from './pages/NotFoundPage';


const router = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>
);

export default router;
