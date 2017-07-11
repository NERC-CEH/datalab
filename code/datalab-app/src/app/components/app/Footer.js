import React from 'react';
import { Divider, Segment } from 'semantic-ui-react';
import version from '../../version';

const Footer = () => (
  <Segment basic>
    <Divider/>
    {`Version: ${version || 'pre-release'}`}
  </Segment>
);

export default Footer;
