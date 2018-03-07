import React from 'react';
import PropTypes from 'prop-types';
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

const PrivateApp = ({ userPermissions }) => {
  const ListStorage = PermissionWrapper('project:storage:list', userPermissions);
  const ListStacks = PermissionWrapper('project:stacks:list', userPermissions);

  return (
    <NavigationContainer>
      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/storage" render={ListStorage(DataStoragePage)} />
        <Route exact path="/notebooks" render={ListStacks(NotebooksPage)} />
        <Route exact path="/publishing" render={ListStacks(PublishingPage)} />
        <Route exact path="/dask" component={DaskPage} />
        <Route exact path="/spark" component={SparkPage} />
        <Route component={NotFoundPage} />
      </Switch>
      <Route component={Footer} />
      <ModalRoot />
    </NavigationContainer>
  );
};

const PermissionWrapper = (permission, userPermissions) => (WrappedComponent) => {
  if (userPermissions.includes(permission)) {
    return props => (<WrappedComponent userPermissions={userPermissions} {...props} />);
  }

  return () => (<NotFoundPage />);
};

PrivateApp.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PrivateApp;
