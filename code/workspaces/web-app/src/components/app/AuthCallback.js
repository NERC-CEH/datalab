import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { replace } from 'connected-react-router';
import getAuth from '../../auth/auth';
import authActions from '../../actions/authActions';

class AuthCallback extends Component {
  componentWillMount() {
    if (/access_token|id_token|error/.test(this.props.urlHash)) {
      getAuth().handleAuthentication()
        .then((authResponse) => {
          this.props.actions.userLogsIn(authResponse);
          this.props.actions.routeTo(authResponse.appRedirect);
        })
        .catch(() => {
          // Redirect to home page if auth fails
          this.props.actions.routeTo('/');
        });
    } else {
      // Redirect to projects page if no hash is present
      this.props.actions.routeTo('/projects');
    }
  }

  render() {
    // Callback never renders
    return null;
  }
}

function mapStateToProps({ router: { location: { hash } } }) {
  return {
    urlHash: hash,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...authActions,
      routeTo: replace,
    }, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthCallback);
