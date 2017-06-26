import React from 'react';
import { RaisedButton } from 'material-ui';
import version from '../version';

const HomePage = ({ auth }) => (
  <div>
    <h1>Home Page</h1>
    <div>
      <p>Page contents</p>
      <p>This is the data lab home page.</p>
      <p>{`You are currently ${auth.isAuthenticated() ? 'logged in.' : 'not logged in.'}`}</p>
      <RaisedButton label="login" primary onClick={() => auth.login()} disabled={auth.isAuthenticated()} />
      <br/>
      <RaisedButton label="logout" primary onClick={() => auth.logout()} disabled={!auth.isAuthenticated()} />
      <hr/>
      {`Version: ${version || 'pre-release'}`}
    </div>
  </div>
);

export default HomePage;
