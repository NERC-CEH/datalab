import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import App from './components/App';
import NotFoundPage from './pages/NotFoundPage';
import './styles/index.css';

ReactDOM.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route component={NotFoundPage} />
    </Switch>
  </BrowserRouter>,
  document.getElementById('root')
);
