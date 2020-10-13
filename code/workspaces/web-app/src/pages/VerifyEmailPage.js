import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import VerifyEmail from '../components/welcome/VerifyEmail';

const useStyles = makeStyles(theme => ({
  page: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.backgroundDark,
    minHeight: '100vh',
  },
}));

const VerifyEmailPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      <VerifyEmail/>
    </div>
  );
};

export default VerifyEmailPage;
