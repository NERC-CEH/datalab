import React from 'react';
import { RaisedButton } from 'material-ui';
import { login, logout, isAuthenticated } from '../auth/auth';
import version from '../version';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <div>
      <p>Page contents</p>
      <p>This is the data lab home page.</p>
      <p>{`You are currently ${isAuthenticated() ? 'logged in.' : 'not logged in.'}`}</p>
      <RaisedButton label="login" primary onClick={() => login()} disabled={isAuthenticated()} />
      <br/>
      <RaisedButton label="logout" primary onClick={() => logout()} disabled={!isAuthenticated()} />
      <hr/>
      {`Version: ${version || 'pre-release'}`}
    </div>
  </div>
);

export default HomePage;
