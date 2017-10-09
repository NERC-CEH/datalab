import React from 'react';
import { withStyles } from 'material-ui/styles';
import { blueGrey, teal } from 'material-ui/colors';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import datalabsLogo from '../../../assets/images/datalabs-vert.png';
import auth from '../../auth/auth';

const styles = theme => ({
  root: {
    paddingTop: 62,
    backgroundColor: blueGrey[900],
    textAlign: 'center',
  },
  logo: {
    height: 300,
    marginTop: 60,
  },
  tagLine: {
    color: blueGrey[50],
    padding: 20,
  },
  raisedButton: {
    backgroundColor: teal[400],
    margin: 20,
    '&:hover': {
      backgroundColor: teal[400],
      margin: 20,
    },
  },
});

const tagLine = 'DataLabs provides you with tools to power your research and share the results';

const HeroBar = ({ classes }) => (
  <div className={classes.root}>
    <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
    <Typography className={classes.tagLine} type="title">{tagLine}</Typography>
    <Button className={classes.raisedButton} color="primary" raised>Sign Up</Button>
    <Button className={classes.raisedButton} color="primary" raised> Log In</Button>
  </div>
);

export default withStyles(styles)(HeroBar);
