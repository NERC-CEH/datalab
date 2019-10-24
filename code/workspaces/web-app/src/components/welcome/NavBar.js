import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import datalabsLogo from '../../assets/images/datalabs-hori.png';
import getAuth from '../../auth/auth';
import navBarLinks from '../../constants/navBarLinks';
import TopBarButton from '../app/TopBarButton';
import PrimaryActionButton from '../common/buttons/PrimaryActionButton';

const publicNavLinks = [
  navBarLinks.SLACK,
  navBarLinks.DISCOURSE,
  navBarLinks.GITHUB,
  navBarLinks.DOCKER_HUB,
];

const styles = theme => ({
  logo: {
    height: theme.shape.topBarContentHeight - theme.spacing(0.5),
    width: 'auto',
  },
  spacer: {
    flex: 1,
  },
  appBar: {
    background: theme.palette.backgroundDark,
    height: theme.shape.topBarHeight,
    marginTop: -theme.shape.topBarHeight, // hides component behind hero banner
    width: '100%',
    display: 'block',
    position: 'sticky',
    top: 0,
    zIndex: 1,
  },
  toolBar: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.shape.topBarPaddingTopBottom}px ${theme.shape.topBarPaddingLeftRight}px`,
    maxHeight: theme.shape.topBarContentHeight,
  },
  buttons: {
    display: 'flex',
    marginLeft: theme.spacing(6),
  },
  login: {
    marginLeft: theme.spacing(0.5),
    maxHeight: theme.shape.topBarContentHeight,
  },
});

const PublicNavBarContent = ({ classes }) => (
  <div className={classes.appBar}>
    <div className={classes.toolBar}>
      <img className={classes.logo} src={datalabsLogo} alt="DataLabs-Logo" />
      <div className={classes.spacer} />
      <div className={classes.buttons}>
        {publicNavLinks.map(({ displayName, href }) => <TopBarButton
          key={displayName}
          label={displayName}
          onClick={() => window.open(href)}/>)}
      </div>
      <PrimaryActionButton className={classes.login} color="primary" onClick={getAuth().login}>Log In</PrimaryActionButton>
    </div>
  </div>
);

PublicNavBarContent.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(PublicNavBarContent);
