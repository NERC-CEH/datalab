import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Typography from '@mui/material/Typography';
import { useHistory } from 'react-router-dom';
import datalabsLogo from '../../assets/images/datalabs-vert.png';
import { getAuth } from '../../config/auth';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import PagePrimaryActionButton from '../common/buttons/PagePrimaryActionButton';

const styles = theme => ({
  bar: {
    backgroundColor: theme.palette.backgroundDark,
    textAlign: 'center',
    zIndex: 2,
    padding: `${theme.spacing(14)} ${theme.spacing(2)}`,
  },
  logo: {
    height: 300,
  },
  tagLine: {
    color: theme.palette.secondary[50],
    padding: 20,
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    margin: `${theme.spacing(4)} ${theme.spacing(1)}`,
    marginBottom: 0,
  },
  button: {
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
});

const tagLine = 'DataLabs provides you with tools to power your research and share the results';

const HeroBar = ({ classes }) => {
  const history = useHistory();

  const signUp = () => {
    const auth = getAuth();
    if (auth.signUpConfig().selfService) {
      auth.selfServiceSignUp();
    } else {
      history.push('/sign-up');
    }
  };

  return (
  <div className={classes.bar}>
    <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
    <Typography className={classes.tagLine} variant="h6">{tagLine}</Typography>
    <div className={classes.buttons}>
      <PagePrimaryActionButton className={classes.button} color="primary" onClick={signUp}>Sign Up</PagePrimaryActionButton>
      <PrimaryActionButton className={classes.button} color="primary" onClick={getAuth().login}>Log In</PrimaryActionButton>
    </div>
  </div>
  );
};

HeroBar.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(HeroBar);
