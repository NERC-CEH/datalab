import React from 'react';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import NavBarLinkButton from './NavBarLinkButton';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import auth from '../../auth/auth';

const publicNavLinks = [
  { name: 'Slack' },
  { name: 'Discourse' },
  { name: 'GitHub' },
  { name: 'DockerHub' },
];

const styles = theme => ({
  logo: {
    width: 140,
    marginLeft: 24,
  },
  spacer: {
    flex: 1,
  },
});

const PublicNavBarContent = ({ classes }) => (
  <AppBar position="fixed">
    <Toolbar>
      <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
      <div className={classes.spacer} />
      {publicNavLinks.map(props => <NavBarLinkButton key={props.name}>{props.name}</NavBarLinkButton>)}
      <Button color="primary" raised>Log In</Button>
    </Toolbar>
  </AppBar>
);

export default withStyles(styles)(PublicNavBarContent);
