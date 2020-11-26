import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import { SYSTEM_INSTANCE_ADMIN } from 'common/src/permissionTypes';
import UserInfo from './UserIcon';
import datalabsLogo from '../../assets/images/datalabs-hori.png';
import { extendSubdomain } from '../../core/getDomainInfo';
import TopBarButton from './TopBarButton';
import navBarLinks from '../../constants/navBarLinks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';

const styles = theme => ({
  appBar: {
    background: theme.palette.backgroundDark,
    height: theme.shape.topBarHeight,
    width: '100%',
    display: 'block',
    position: 'fixed',
    top: 0,
  },
  toolBar: {
    display: 'flex',
    alignItems: 'center',
    padding: `${theme.shape.topBarPaddingTopBottom}px ${theme.shape.topBarPaddingLeftRight}px`,
    maxHeight: theme.shape.topBarContentHeight,
  },
  datalabsLogo: {
    height: theme.shape.topBarContentHeight - theme.spacing(0.5),
    width: 'auto',
  },
  buttons: {
    display: 'flex',
    marginLeft: theme.spacing(6),
  },
});

const datalabLinks = [
  { ...navBarLinks.SLACK },
  { displayName: 'Help', href: extendSubdomain('docs') },
];

const TopBar = ({ classes, identity }) => {
  const userPermissions = useCurrentUserPermissions().value;
  return (
    <div className={classes.appBar}>
      <div className={classes.toolBar}>
        <img className={classes.datalabsLogo} src={datalabsLogo} alt={'datalabs-logo'}/>
        <div className={classes.buttons}>
          {userPermissions.includes(SYSTEM_INSTANCE_ADMIN)
          && <TopBarButton to="/admin" label="Admin"/>
          }
          <TopBarButton to="/projects" label="Projects"/>
          {datalabLinks.map(({ displayName, href, icon }) => <TopBarButton
            key={`nav-link-${displayName}`}
            label={displayName}
            onClick={() => window.open(href)}
          />)}
        </div>
        <div style={{ flex: 1 }}/>
        <UserInfo className={classes.userInfo} identity={identity}/>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  identity: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
