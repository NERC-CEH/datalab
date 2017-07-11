import React from 'react';
import PropTypes from 'prop-types';
import { Button, Segment } from 'semantic-ui-react';
import auth from '../../auth/auth';

const TopBar = ({ topBarStyle }) => (
  <Segment basic inverted textAlign="right" style={topBarStyle}>
    <Button primary onClick={() => auth.logout()}>Logout</Button>
  </Segment>
);

TopBar.propTypes = {
  topBarStyle: PropTypes.object,
};

export default TopBar;
