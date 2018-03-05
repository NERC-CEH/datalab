import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NavigationContainer from './containers/app/NavigationContainer';
import NotFoundPage from './pages/NotFoundPage';
import Footer from './components/app/Footer';
import LandingPage from './pages/LandingPage';
import DataStoragePage from './pages/DataStoragePage';
import NotebooksPage from './pages/NotebooksPage';
import PublishingPage from './pages/PublishingPage';
import DaskPage from './pages/DaskPage';
import SparkPage from './pages/SparkPage';
import ModalRoot from './containers/modal/ModalRoot';

const PrivateApp = () => (
  <NavigationContainer>
    <Switch>
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/storage" component={DataStoragePage} />
      <Route exact path="/notebooks" component={NotebooksPage} />
      <Route exact path="/publishing" component={PublishingPage} />
      <Route exact path="/dask" component={DaskPage} />
      <Route exact path="/spark" component={SparkPage} />
      <Route component={NotFoundPage} />
    </Switch>
    <Route component={Footer} />
    <ModalRoot />
  </NavigationContainer>
);

export default PrivateApp;
