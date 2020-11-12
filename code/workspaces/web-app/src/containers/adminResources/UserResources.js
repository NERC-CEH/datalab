import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from './ResourceAccordion';
import allFiltersOff from './allFiltersOff';

const useStyles = makeStyles(theme => ({
  container: {
    marginBottom: theme.spacing(10),
  },
  resources: {
    marginLeft: theme.spacing(8),
  },
  heading: {
    margin: [[theme.spacing(2), 0]],
  },
  summary: {
    display: 'flex',
    flexDirection: 'column',
  },
  instanceAdmin: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'baseline',
  },
}));

export function userSummary(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  const info = [];
  const plural = num => (num !== 1 ? 's' : '');

  // project roles
  if (filtersOff || filters.projectViewer) {
    const numProjects = roles.projectViewer.length;
    info.push(`${numProjects} project${plural(numProjects)}`);
  } else if (filters.projectUser) {
    const numProjects = roles.projectUser.length;
    info.push(`${numProjects} project${plural(numProjects)}`);
  } else if (filters.projectAdmin) {
    const numProjects = roles.projectAdmin.length;
    info.push(`${numProjects} project${plural(numProjects)}`);
  }

  // site roles
  if (filtersOff || filters.siteOwner) {
    const numSites = roles.siteOwner.length;
    info.push(`${numSites} site${plural(numSites)}`);
  }

  // notebook roles
  if (filtersOff || filters.notebookOwner) {
    const numNotebooks = roles.notebookOwner.length;
    info.push(`${numNotebooks} notebook${plural(numNotebooks)}`);
  }

  // storage roles
  if (filtersOff || filters.storageAccess) {
    const numDataStores = roles.storageAccess.length;
    info.push(`${numDataStores} data store${plural(numDataStores)}`);
  }

  return info.join(', ');
}

export function projectsToShow(filters, roles) {
  const filtersOff = allFiltersOff(filters);
  const projectKeys = [];

  // project roles
  if (filtersOff || filters.projectViewer) {
    projectKeys.push(...roles.projectViewer);
  }
  if (filtersOff || filters.projectUser) {
    projectKeys.push(...roles.projectUser);
  }
  if (filtersOff || filters.projectAdmin) {
    projectKeys.push(...roles.projectAdmin);
  }

  // site roles
  if (filtersOff || filters.siteOwner) {
    projectKeys.push(...roles.siteOwner.map(resource => resource.projectKey));
  }

  // notebook roles
  if (filtersOff || filters.notebookOwner) {
    projectKeys.push(...roles.notebookOwner.map(resource => resource.projectKey));
  }

  // storage roles
  if (filtersOff || filters.storageAccess) {
    projectKeys.push(...roles.storageAccess.map(resource => resource.projectKey));
  }

  const uniqueProjectKeys = [...new Set(projectKeys)].sort();
  return uniqueProjectKeys;
}

export default function UserResources(props) {
  const classes = useStyles();
  const { userPermissions, user, filters, roles } = props;

  if (!roles) { return null; }
  const projects = projectsToShow(filters, roles);

  return (
    <div className={classes.container}>
      <ResourceAccordion key={user.userId} defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.summary}>
            <Typography variant="h5" className={classes.heading}>{user.name}</Typography>
            <Typography variant="body2">{userSummary(filters, roles)}</Typography>
          </div>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            <div className={classes.instanceAdmin}>
              <Typography variant="h5">Instance admin</Typography>
              <Checkbox checked={roles.instanceAdmin} name="instanceAdmin" color="primary" disabled />
            </div>
            {JSON.stringify(projects)}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
