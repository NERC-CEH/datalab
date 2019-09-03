import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core';
import Page from './Page';

const styles = theme => ({
  textInput: {
    margin: `${theme.spacing(2)}px 0`,
  },
});

const SettingsPage = ({ classes, userPermissions }) => (
  <Page title="Settings">
  </Page>
);

SettingsPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default withStyles(styles)(SettingsPage);
