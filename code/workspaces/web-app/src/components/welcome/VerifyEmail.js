import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import datalabsLogo from '../../assets/images/datalabs-vert.png';
import PagePrimaryActionButton from '../common/buttons/PagePrimaryActionButton';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';

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
}));

const tagLine = `Before logging in you need to verify your e-mail address. Please use the
  link in the e-mail which will be sent to you shortly. Note that you may have to check
  your spam folder. Once verified, please click the button below.`;

const VerifyEmail = () => {
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo"/>
      <div className={classes.textContainer}>
        <Typography className={classes.text} variant="h5">Verify Email</Typography>
        <Typography className={classes.text} variant="body1">{tagLine}</Typography>
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
          onClick={() => { window.location.href = '/projects'; }}
        >
          I've verified my email
        </PagePrimaryActionButton>
      </div>
    </div>
  );
};

export default VerifyEmail;
