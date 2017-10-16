import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import AppBar from 'material-ui/AppBar';
import Toolbar from 'material-ui/Toolbar';
import Button from 'material-ui/Button';
import NavBarLinkButton from './NavBarLinkButton';
import datalabsLogo from '../../../assets/images/datalabs-hori.png';
import auth from '../../auth/auth';

export const datalabLinks = {
  discourse: { displayName: 'Discourse', href: 'https://www.discourse.org/' },
  dockerHub: { displayName: 'Docker Hub', href: 'https://hub.docker.com/u/nerc/' },
  github: { displayName: 'GitHub', href: 'https://github.com/orgs/NERC-CEH/teams/nerc-data-lab/repositories' },
  slack: { displayName: 'Slack', href: 'http://slack.com/' },
};

const publicNavLinks = [
  datalabLinks.slack,
  datalabLinks.discourse,
  datalabLinks.github,
  datalabLinks.dockerHub,
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
      <Button color="primary" raised onClick={auth.login}>Log In</Button>
    </Toolbar>
  </AppBar>
);

PublicNavBarContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublicNavBarContent);
