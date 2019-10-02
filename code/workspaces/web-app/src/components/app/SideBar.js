import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import PropTypes from 'prop-types';
import React from 'react';
import { permissionTypes } from 'common';
import PermissionWrapper from '../common/ComponentPermissionWrapper';
import SideBarGroup from './SideBarGroup';
import SideBarButton from './SideBarButton';
import ProjectTitleContainer from '../../containers/projectInfo/ProjectTitleContainer';

const { projectPermissions: { PROJECT_KEY_STORAGE_LIST, PROJECT_KEY_STACKS_LIST, PROJECT_KEY_SETTINGS_LIST }, projectKeyPermission } = permissionTypes;

export const drawerWidth = 200;

const styles = theme => ({
  itemList: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    padding: 0,
  },
  sideBar: {
    background: theme.palette.sideBarBackground,
    height: '100%',
    width: drawerWidth,
    minWidth: drawerWidth,
    borderRight: `1px solid ${theme.palette.divider}`,
    overflow: 'auto',
    padding: `0 ${theme.spacing(2)}px`,
  },
  projectTitleLI: {
    paddingLeft: 7,
  },
  projectTitleLIT: {
    fontSize: 'larger',
  },
});

const InfoGroup = ({ classes, projectKey }) => (
  <SideBarGroup key='Info'>
    <ListItem className={classes.projectTitleLI}>
      <ListItemText classes={{ primary: classes.projectTitleLIT }}><ProjectTitleContainer projectKey={projectKey} /></ListItemText>
    </ListItem>
    <SideBarButton to={`/projects/${projectKey}/info`} label="Information" icon="info_outline" />
  </SideBarGroup>
);

const AnalysisGroup = ({ userPermissions, projectKey }) => (
  <SideBarGroup title='Analysis'>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`/projects/${projectKey}/notebooks`} label="Notebooks" icon="book" />
    </PermissionWrapper>
    <SideBarButton to={`/projects/${projectKey}/dask`} label="Dask" icon="apps" />
    <SideBarButton to={`/projects/${projectKey}/spark`} label="Spark" icon="apps" />
  </SideBarGroup>
);

const MiscGroup = ({ userPermissions, projectKey }) => (
  <SideBarGroup>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STORAGE_LIST, projectKey)}>
      <SideBarButton to={`/projects/${projectKey}/storage`} label="Storage" icon="storage" />
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_STACKS_LIST, projectKey)}>
      <SideBarButton to={`/projects/${projectKey}/publishing`} label="Sites" icon="web" />
    </PermissionWrapper>
    <PermissionWrapper userPermissions={userPermissions} permission={projectKeyPermission(PROJECT_KEY_SETTINGS_LIST, projectKey)}>
      <SideBarButton to={`/projects/${projectKey}/settings`} label="Settings" icon="settings" />
    </PermissionWrapper>
  </SideBarGroup>
);

const SideBar = ({ classes, userPermissions, projectKey }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <InfoGroup classes={classes} projectKey={projectKey} />
      <AnalysisGroup userPermissions={userPermissions} projectKey={projectKey} />
      <MiscGroup userPermissions={userPermissions} projectKey={projectKey} />
    </List>
  </div>
);

const SideBarAnalysis = ({ classes, userPermissions, projectKey }) => (
  <div className={classes.sideBar}>
    <List className={classes.itemList}>
      <AnalysisGroup userPermissions={userPermissions} projectKey={projectKey} />
      <MiscGroup userPermissions={userPermissions} projectKey={projectKey} />
    </List>
  </div>
);

SideBar.propTypes = {
  classes: PropTypes.object.isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectKey: PropTypes.string.isRequired,
};

const StyledSideBarAnalysis = withStyles(styles)(SideBarAnalysis);
export { StyledSideBarAnalysis }; // export for testing
export default withStyles(styles)(SideBar);
