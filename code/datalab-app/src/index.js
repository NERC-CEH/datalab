import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import App from './components/App';
import NotFoundPage from './pages/NotFoundPage';
import './styles/index.css';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={App} />
        <Route component={NotFoundPage} />
      </Switch>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);
