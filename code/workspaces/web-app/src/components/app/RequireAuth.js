import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { isEmpty } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core';
import getAuth from '../../auth/auth';
import authActions from '../../actions/authActions';
import { useCurrentUserPermissions, useCurrentUserTokens } from '../../hooks/authHooks';

const circularProgressSize = 70;

const useStyles = makeStyles(theme => ({
  circularProgress: {
    // center the progress in the middle of the page
    position: 'relative',
    top: `calc(50vh - ${circularProgressSize / 2}px)`,
    left: `calc(50vw - ${circularProgressSize / 2}px)`,
  },
}));

export const effectFn = (dispatch) => {
  const currentSession = getAuth().getCurrentSession();
  if (currentSession) {
    dispatch(authActions.userLogsIn(currentSession));
    dispatch(authActions.getUserPermissions());
  }
};

const RequireAuth = ({ path, exact, strict, PrivateComponent, PublicComponent }) => {
  const permissions = useCurrentUserPermissions();
  const tokens = useCurrentUserTokens();
  const dispatch = useDispatch();
  const classes = useStyles();

  useLayoutEffect(() => { effectFn(dispatch); }, [dispatch]);

  return <Route
    path={path}
    exact={exact}
    strict={strict}
    render={switchContent(tokens, permissions, PrivateComponent, PublicComponent, classes)}
  />;
};

const switchContent = (tokens, permissions, PrivateComponent, PublicComponent, classes) => {
  if (permissions.fetching) {
    return () => (
      <CircularProgress
        className={classes.circularProgress}
        size={circularProgressSize}
      />
    );
  }

  if (isUserLoggedIn(tokens)) {
    return props => (<PrivateComponent {...props} promisedUserPermissions={permissions} />);
  }

  return props => (<PublicComponent {...props} />);
};

const isUserLoggedIn = tokens => !isEmpty(tokens);

RequireAuth.propTypes = {
  PrivateComponent: PropTypes.func.isRequired,
  PublicComponent: PropTypes.func.isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
};

export default RequireAuth;
