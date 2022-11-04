import React from 'react';
import Divider from '@mui/material/Divider';
import withStyles from '@mui/styles/withStyles';
import { Typography } from '@mui/material';
import { getVersion } from '../../config/version';

const styles = theme => ({
  divider: {
    marginTop: theme.spacing(8),
  },
  versionText: {
    margin: `${theme.spacing(2)} 0`,
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
