import React from 'react';
import version from '../../version';

const Footer = () => (
  <div>
    <br/><hr/>
    {`Version: ${version || 'pre-release'}`}
  </div>
);

export default Footer;
