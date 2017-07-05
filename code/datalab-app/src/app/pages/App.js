import React from 'react';
import PropTypes from 'prop-types';
import { Container } from 'semantic-ui-react';
import Navigation from '../components/app/Navigation';
import Footer from '../components/app/Footer';

const App = ({ children }) => (
  <div>
    <Navigation />
    <Container>{children}</Container>
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
