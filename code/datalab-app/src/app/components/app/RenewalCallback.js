import { Component } from 'react';

class AuthCallback extends Component {
  componentWillMount() {
    window.parent.postMessage(window.location.hash, '*');
  }

  render() {
    // Callback never renders
    return null;
  }
}

export default AuthCallback;
