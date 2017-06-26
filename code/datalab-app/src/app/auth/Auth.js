import auth0 from 'auth0-js';
import { EventEmitter } from 'events';
import history from '../store/browserHistory';
import authConfig from './authConfig';

export default class Auth extends EventEmitter {
  auth0 = new auth0.WebAuth(authConfig);

  constructor() {
    super();
    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);
    this.handleAuthentication = this.handleAuthentication.bind(this);
    this.isAuthenticated = this.isAuthenticated.bind(this);
  }

  login() {
    this.auth0.authorize();
  }

  handleAuthentication() {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.setSession(authResult);
        console.log('handle auth funct');
        history.replace('/'); // demo path
      } else if (err) {
        history.replace('/');  // demo path
        console.log(err); // User notification
      }
    });
  }

  setSession(authResult) { // eslint-disable-line class-methods-use-this
    if (authResult && authResult.accessToken && authResult.idToken) {
      const expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
      localStorage.setItem('access_token', authResult.accessToken);
      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('expires_at', expiresAt);
      console.log('set session');
      history.replace('/'); // demo path
    }
  }

  logout() { // eslint-disable-line class-methods-use-this
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    console.log('logout funct');
    history.replace('/');  // demo path
  }

  isAuthenticated() { // eslint-disable-line class-methods-use-this
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return new Date().getTime() < expiresAt;
  }
}
