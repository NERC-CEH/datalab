import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './pages/App';
import HomePage from './pages/HomePage';
import ExamplePage from './pages/ExamplePage';
import NotFoundPage from './pages/NotFoundPage';


const router = () => (
  <BrowserRouter>
    <div>
      <Route component={App}/>
      <Switch>
        <Route exact path="/" component={HomePage}/>
        <Route exact path="/example" component={ExamplePage}/>
        <Route component={NotFoundPage} />
      </Switch>
    </div>
  </BrowserRouter>
);

export default router;
