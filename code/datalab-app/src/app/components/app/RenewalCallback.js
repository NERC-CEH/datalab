import { Component } from 'react';
import { connect } from 'react-redux';
import auth0 from 'auth0-js';
import { pick } from 'lodash';
import authConfig from '../../auth/authConfig';

class AuthCallback extends Component {
  componentWillMount() {
    if (/access_token|id_token|error/.test(this.props.urlHash)) {
      const authZero = new auth0.WebAuth(pick(authConfig, ['domain', 'clientID']));
      authZero.parseHash(window.location.hash, (err, result) => {
        window.parent.postMessage(err || result, '*');
      });
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

export default connect(mapStateToProps)(AuthCallback);
