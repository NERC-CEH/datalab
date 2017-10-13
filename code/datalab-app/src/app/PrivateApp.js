import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Navigation from './components/app/Navigation';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';
import LandingPage from './pages/LandingPage';
import DataStorageTablePage from './pages/DataStorageTablePage';
import NotebooksPage from './pages/NotebooksPage';
import PublishingPage from './pages/PublishingPage';
import ModalRoot from './containers/modal/ModalRoot';

const PrivateApp = () => (
  <Navigation>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/storage" component={DataStorageTablePage} />
      <Route exact path="/notebooks" component={NotebooksPage} />
      <Route exact path="/publishing" component={PublishingPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
    <ModalRoot />
  </Navigation>
);

export default PrivateApp;
