import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import NavBarLinkButton from './NavBarLinkButton';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import auth from '../../auth/auth';
import navBarLinks from '../../constants/navBarLinks';

const publicNavLinks = [
  navBarLinks.SLACK,
  navBarLinks.DISCOURSE,
  navBarLinks.GITHUB,
  navBarLinks.DOCKER_HUB,
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
      {publicNavLinks.map(({ displayName, href }) => <NavBarLinkButton key={displayName} onClick={() => window.open(href)}>{displayName}</NavBarLinkButton>)}
      <Button color="primary" onClick={auth().login}>Log In</Button>
    </Toolbar>
  </AppBar>
);

PublicNavBarContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublicNavBarContent);
