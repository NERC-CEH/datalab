import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import VerifyEmail from '../components/welcome/VerifyEmail';

const styles = theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    background: theme.palette.backgroundColor,
  },
});

const VerifyEmailPage = ({ classes }) => (
  <div className={classes.page}>
    <VerifyEmail/>
  </div>
);

export default withStyles(styles)(VerifyEmailPage);
