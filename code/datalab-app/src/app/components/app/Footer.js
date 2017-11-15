import React from 'react';
import Divider from 'material-ui/Divider';
import { withStyles } from 'material-ui/styles';
import Segment from './Segment';
import version from '../../version';

const styles = theme => ({
  versionText: {
    marginTop: theme.spacing.unit * 2,
  },
});

const Footer = ({ classes }) => (
  <Segment>
    <Divider/>
    <p className={classes.versionText}>
      {`Version: ${version || 'pre-release'}`}
    </p>
  </Segment>
);

export default withStyles(styles)(Footer);
