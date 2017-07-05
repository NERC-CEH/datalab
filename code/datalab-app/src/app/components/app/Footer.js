import React from 'react';
import { Container } from 'semantic-ui-react';
import version from '../../version';

const Footer = () => (
  <Container>
    <br/><hr/>
    {`Version: ${version || 'pre-release'}`}
  </Container>
);

export default Footer;
