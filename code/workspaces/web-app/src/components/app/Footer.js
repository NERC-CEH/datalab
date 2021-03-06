import React from 'react';
import Divider from '@material-ui/core/Divider';
import { withStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import { getVersion } from '../../config/version';

const styles = theme => ({
  divider: {
    marginTop: theme.spacing(8),
  },
  versionText: {
    margin: `${theme.spacing(2)}px 0`,
  },
});

const Footer = ({ classes }) => (
  <div>
    <Divider className={classes.divider} />
    <Typography variant='body2' className={classes.versionText}>
      {`Version: ${getVersion()}`}
    </Typography>
  </div>
);

export default withStyles(styles)(Footer);
