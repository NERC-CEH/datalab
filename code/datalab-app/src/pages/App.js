import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/app/Navigation'

const App = ({ children }) => (
  <div>
    <Navigation />
    <div id="page-container">{children}</div>
  </div>
);

App.PropTypes = {
  children: PropTypes.element,
};

export default App;
