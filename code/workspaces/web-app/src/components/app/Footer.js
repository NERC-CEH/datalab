import React from 'react';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { version } from '../../version';
import Segment from './Segment';

const styles = theme => ({
  versionText: {
    marginTop: theme.spacing(2),
  },
});

const Footer = ({ classes }) => (
  <Segment>
    <Divider/>
    <p className={classes.versionText}>
      {`Version: ${version}`}
    </p>
  </Segment>
);

export default withStyles(styles)(Footer);
