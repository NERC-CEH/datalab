import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import auth from '../../auth/auth';
import authActions from '../../actions/authActions';

class RequireAuth extends Component {
  constructor(props, context) {
    super(props, context);
    this.isUserLoggedIn = this.isUserLoggedIn.bind(this);
    this.switchContent = this.switchContent.bind(this);
  }

  componentWillMount() {
    const currentSession = auth.getCurrentSession();
    if (currentSession) {
      this.props.actions.userLogsIn(currentSession);
    }
  }

  isUserLoggedIn() {
    return this.props.user && auth.isAuthenticated(this.props.user);
  }

  switchContent() {
    const PrivateComponent = this.props.PrivateComponent;
    const PublicComponent = this.props.PublicComponent;

    if (this.isUserLoggedIn()) {
      return props => (<PrivateComponent {...props} />);
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
  user: PropTypes.object,
  path: PropTypes.string,
  exact: PropTypes.bool,
  strict: PropTypes.bool,
  actions: PropTypes.shape({
    userLogsIn: PropTypes.func.isRequired,
  }),
};

function mapStateToProps({ authentication: { user } }) {
  return {
    user,
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
