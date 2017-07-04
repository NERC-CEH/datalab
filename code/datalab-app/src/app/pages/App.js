import React from 'react';
import PropTypes from 'prop-types';
import Navigation from '../components/app/Navigation';
import Footer from '../components/app/Footer';

const App = ({ children }) => (
  <div>
    <Navigation />
    <div id="page-container">{children}</div>
    <Footer />
  </div>
);

App.propTypes = {
  children: PropTypes.element,
};

App.defaultProps = {
  children: null,
};

export default App;
