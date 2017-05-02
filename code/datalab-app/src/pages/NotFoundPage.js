import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => (
    <div className="App">
      <div className="App-header">
        <h4>
          404 Page Not Found
        </h4>
      </div>
      <p className="App-Intro">
        <Link to="/">Go to homepage</Link>
      </p>
    </div>
);

export default NotFoundPage;
