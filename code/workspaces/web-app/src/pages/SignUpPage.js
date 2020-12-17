import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import SignUp from '../components/welcome/SignUp';

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

const SignUpPage = () => {
  const classes = useStyles();
  return (
    <div className={classes.page}>
      <SignUp />
    </div>
  );
};

export default SignUpPage;
