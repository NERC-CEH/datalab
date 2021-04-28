import React from 'react';
import PropTypes from 'prop-types';
import { withStyles, createStyles } from '@material-ui/core/styles';
import { permissionTypes } from 'common';
import UserIcon from './UserIcon';
import datalabsLogo from '../../assets/images/datalabs-hori.png';
import { extendSubdomain } from '../../core/getDomainInfo';
import TopBarButton from './TopBarButton';
import navBarLinks from '../../constants/navBarLinks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { getCatalogue } from '../../config/catalogue';

const { SYSTEM_INSTANCE_ADMIN, SYSTEM_DATA_MANAGER } = permissionTypes;

const styles = theme => createStyles({
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
  const catalogue = getCatalogue();
  return (
    <div className={classes.appBar}>
      <div className={classes.toolBar}>
        <img className={classes.datalabsLogo} src={datalabsLogo} alt={'datalabs-logo'}/>
        <div className={classes.buttons}>
          {userPermissions.includes(SYSTEM_INSTANCE_ADMIN)
          && <TopBarButton to="/admin" label="Admin"/>
          }
          {userPermissions.includes(SYSTEM_DATA_MANAGER)
          && <TopBarButton to="/assets" label="Asset Repo"/>
          }
          <TopBarButton to="/projects" label="Projects"/>
          {catalogue.available
          && <TopBarButton label="Catalogue" onClick={() => window.open(catalogue.url)} />
          }
          {datalabLinks.map(({ displayName, href }) => <TopBarButton
            key={`nav-link-${displayName}`}
            label={displayName}
            onClick={() => window.open(href)}
          />)}
        </div>
        <div style={{ flex: 1 }}/>
        <UserIcon identity={identity}/>
      </div>
    </div>
  );
};

TopBar.propTypes = {
  identity: PropTypes.object.isRequired,
};

export default withStyles(styles)(TopBar);
