import React from 'react';
import { withStyles } from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import datalabsLogo from '../../../assets/images/datalabs-vert.png';
import auth from '../../auth/auth';

const styles = theme => ({
  bar: {
    paddingTop: 62,
    backgroundColor: theme.palette.secondary[900],
    textAlign: 'center',
  },
  logo: {
    height: 300,
    marginTop: 60,
  },
  tagLine: {
    color: theme.palette.secondary[50],
    padding: 20,
  },
  button: {
    margin: 20,
  },
});

const tagLine = 'DataLabs provides you with tools to power your research and share the results';

const HeroBar = ({ classes }) => (
  <div className={classes.bar}>
    <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
    <Typography className={classes.tagLine} type="title">{tagLine}</Typography>
    <Button className={classes.button} color="primary" raised disabled>Sign Up</Button>
    <Button className={classes.button} color="primary" raised onClick={auth.login}> Log In</Button>
  </div>
);

export default withStyles(styles)(HeroBar);
