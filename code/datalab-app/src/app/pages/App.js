import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/app/Navigation';

const App = ({ children }) => (
  <div>
    <Navigation />
    <div id="page-container">{children}</div>
  </div>
);

App.propTypes = {
  children: PropTypes.element,
};

App.defaultProps = {
  children: null,
};

export default App;
