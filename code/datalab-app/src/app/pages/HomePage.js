import React from 'react';
import version from '../version';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <div>
      <p>Page contents</p>
      {`Version: ${version || 'pre-release'}`}
    </div>
  </div>
);

export default HomePage;
