import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core';
import getAuth from '../../auth/auth';
import authActions from '../../actions/authActions';

const circularProgressSize = 70;

const styles = theme => ({
  circularProgress: {
    // center the progress in the middle of the page
    position: 'relative',
    top: `calc(50vh - ${circularProgressSize / 2}px)`,
    left: `calc(50vw - ${circularProgressSize / 2}px)`,
  },
});

class RequireAuth extends Component {
  componentWillMount() {
    const currentSession = getAuth().getCurrentSession();
    if (currentSession) {
      this.props.actions.userLogsIn(currentSession);
      this.props.actions.getUserPermissions();
    }
  }

  isUserLoggedIn() {
    return !isEmpty(this.props.tokens);
  }

  switchContent() {
    const { PrivateComponent, PublicComponent } = this.props;

    if (this.props.permissions.fetching) {
      return () => (
        <CircularProgress
          className={this.props.classes.circularProgress}
          size={circularProgressSize}
        />
      );
    }

    if (this.isUserLoggedIn()) {
      return props => (<PrivateComponent {...props} promisedUserPermissions={this.props.permissions} />);
    }

    return props => (<PublicComponent {...props} />);
  }

  render() {
    const props = {
      path: this.props.path,
      exact: this.props.exact,
      strict: this.props.strict,
    };

    return (<Route {...props} render={this.switchContent()} />);
  }
}

RequireAuth.propTypes = {
  PrivateComponent: PropTypes.func.isRequired,
  PublicComponent: PropTypes.func.isRequired,
  tokens: PropTypes.object.isRequired,
  permissions: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  actions: PropTypes.shape({
    userLogsIn: PropTypes.func.isRequired,
    getUserPermissions: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ authentication: { tokens, permissions } }) {
  return {
    tokens,
    permissions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...authActions,
    }, dispatch),
  };
}

export { RequireAuth as PureRequireAuth }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(RequireAuth));
