import React from 'react';
import HomePageContainer from '../components/authExample/HomePageContainer';
import version from '../version';

const HomePage = () => (
  <div>
    <h1>Home Page</h1>
    <HomePageContainer />
    <hr/>
    {`Version: ${version || 'pre-release'}`}
  </div>
);

export default HomePage;
