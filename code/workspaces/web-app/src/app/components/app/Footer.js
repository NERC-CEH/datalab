import React from 'react';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import Segment from './Segment';
import version from '../../version';

const styles = theme => ({
  versionText: {
    marginTop: theme.spacing(2),
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
