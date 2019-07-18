import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { isEmpty } from 'lodash';
import { CircularProgress } from '@material-ui/core/Progress';
import auth from '../../auth/auth';
import authActions from '../../actions/authActions';

class RequireAuth extends Component {
  componentWillMount() {
    const currentSession = auth.getCurrentSession();
    if (currentSession) {
      this.props.actions.userLogsIn(currentSession);
      this.props.actions.getUserPermissions();
    }
  }

  isUserLoggedIn() {
    return !isEmpty(this.props.tokens);
  }

  switchContent() {
    const PrivateComponent = this.props.PrivateComponent;
    const PublicComponent = this.props.PublicComponent;

    if (this.props.permissions.fetching) {
      return () => (<CircularProgress />);
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
export default connect(mapStateToProps, mapDispatchToProps)(RequireAuth);
