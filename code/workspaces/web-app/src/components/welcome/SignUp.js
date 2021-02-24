import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import datalabsLogo from '../../assets/images/datalabs-vert.png';
import PagePrimaryActionButton from '../common/buttons/PagePrimaryActionButton';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';
import { getAuth } from '../../config/auth';

const useStyles = makeStyles(theme => ({
  container: {
    backgroundColor: 'inherit',
    textAlign: 'center',
    padding: theme.spacing(2),
    maxWidth: '40em',
  },
  logo: {
    width: 300,
    maxWidth: '75%',
  },
  textContainer: {
    color: theme.palette.highlightMono,
    padding: [[theme.spacing(8), 0]],
  },
  text: {
    color: 'inherit',
  },
  buttons: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 0,
  },
  button: {
    '& + &': {
      marginLeft: theme.spacing(2),
    },
  },
  link: {
    color: theme.palette.highlightMono,
  },
}));

const SignUp = () => {
  const classes = useStyles();
  const { requestEmail } = getAuth().signUpConfig();

  return (
    <div className={classes.container}>
      <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
      <div className={classes.textContainer}>
        <Typography className={classes.text} variant="h5">Sign Up</Typography>
        <Typography className={classes.text} variant="body1">
          In order to use DataLabs, please email
          {' '}
          <a className={classes.link} href={`mailto:${requestEmail}`}>{requestEmail}</a>
          {' '}
          and request an account.
          Your account will be created using your email address.
        </Typography>
      </div>
      <div className={classes.buttons}>
        <PrimaryActionButton
          className={classes.button}
          color="primary"
          onClick={() => { window.location.href = '/'; }}
        >
          Home
        </PrimaryActionButton>
        <PagePrimaryActionButton
          className={classes.button}
          color="primary"
          href={`mailto:${requestEmail}`}
        >
          Email {requestEmail}
        </PagePrimaryActionButton>
      </div>
    </div>
  );
};

export default SignUp;
