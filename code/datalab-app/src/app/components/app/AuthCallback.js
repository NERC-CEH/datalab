import { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { replace } from 'react-router-redux';
import { handleAuthentication } from '../../auth/auth';
import authActions from '../../actions/authActions';

class AuthCallback extends Component {
  componentWillMount() {
    if (/access_token|id_token|error/.test(this.props.urlHash)) {
      handleAuthentication().then((authResponse) => {
        this.props.actions.userLogsIn(authResponse);
        this.props.actions.routeTo(authResponse.appRedirect);
      });
    }
    // Redirect to home page if auth fails
    this.props.actions.routeTo('/');
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
