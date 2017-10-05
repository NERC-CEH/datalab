import React from 'react';
import { withStyles } from 'material-ui/styles';
import { grey, blueGrey, teal } from 'material-ui/colors';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import classNames from 'classnames';
import { NavLink } from 'react-router-dom';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import auth from '../../auth/auth';

const publicNavLinks = [
  { name: 'Slack' },
  { name: 'Discourse' },
  { name: 'GitHub' },
  { name: 'DockerHub' },
];

const styles = theme => ({
  root: {
    boxShadow: 'none',
  },
  toolbar: {
    paddingLeft: '8%',
    paddingRight: '4%',
    width: '100%',
    padding: 0,
    backgroundColor: blueGrey[900],
  },
  logo: {
    width: 140,
  },
  spacer: {
    flex: 1,
  },
  flatButton: {
    color: grey[600],
    height: 60,
    backgroundColor: 'transparent',
    '&:hover': {
      color: blueGrey[50],
      backgroundColor: 'transparent',
      borderBottom: classNames('4px', 'solid', teal[400]),
      paddingBottom: 7,
      borderRadius: 0,
    },
  },
  raisedButton: {
    backgroundColor: teal[400],
    '&:hover': {
      backgroundColor: teal[400],
    },
  },
});

const PublicNavBarContent = ({ classes }) => (
  <AppBar className={classes.root} position="fixed">
    <Toolbar className={classes.toolbar}>
      <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
      <div className={classes.spacer} />
      {publicNavLinks.map(props => <Button className={classes.flatButton} key={props.name}>{props.name}</Button>)}
      <Button className={classes.raisedButton} color="primary" raised>Log In</Button>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(PublicNavBarContent);
