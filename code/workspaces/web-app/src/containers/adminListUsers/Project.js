import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import { useProjectsArray } from '../../hooks/projectsHooks';
import UserProjects from './UserProjects';
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
  projectRoles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}));

export default function Project(props) {
  const projects = useProjectsArray();
  const classes = useStyles();
  const { userPermissions, projectKey, filters, roles } = props;
  const filtersOff = allFiltersOff(filters);

  const project = projects.value.filter(proj => proj.key === projectKey)[0];

  return (
    <div className={classes.container}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{project.name}</Typography>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            <div className={classes.projectRoles}>
              <Typography variant="body1">Project admin</Typography>
              <Checkbox checked={roles.projectAdmin.includes(projectKey)} name="projectAdmin" color="primary" disabled />
              <Typography variant="body1">Project user</Typography>
              <Checkbox checked={roles.projectUser.includes(projectKey)} name="projectUser" color="primary" disabled />
              <Typography variant="body1">Project viewer</Typography>
              <Checkbox checked={roles.projectViewer.includes(projectKey)} name="projectViewer" color="primary" disabled />
            </div>
            {(filtersOff || filters.projectViewer || filters.projectUser || filters.projectViewer) && UserProjects({ userPermissions, projects: [project] })}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
