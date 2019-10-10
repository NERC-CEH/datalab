import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import useCurrentProjectKey from '../../hooks/useCurrentProjectKey';
import useProjectsArray from '../../hooks/useProjectsArray';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import projectsActions from '../../actions/projectActions';

// Removing switcher margin and giving margin to promised content wrapper
// make size constant when switching from circular progress to dropdown component
const style = theme => ({
  switcher: {
    margin: 0,
  },
  promisedContent: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    margin: `${theme.spacing(2)}px 0`,
  },
  dropdownProgress: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
});

export function createRoute(location, projectKey) {
  const pattern = new RegExp('/projects/.*?/');
  return location.pathname.replace(pattern, `/projects/${projectKey}/`);
}

export function getAccessibleProjects(projects) {
  return {
    ...projects,
    value: projects.value.filter(project => project.accessible),
  };
}

function ProjectSwitcher({ classes }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(projectsActions.loadProjects());
  }, [dispatch]);

  const currentProjectKey = useCurrentProjectKey();
  const projects = useProjectsArray();
  const { location } = window;

  const accessibleProjects = getAccessibleProjects(projects);

  return (
    <PromisedContentWrapper className={classes.promisedContent} promise={currentProjectKey}>
      <Switcher
        accessibleProjects={accessibleProjects}
        currentProject={currentProjectKey}
        location={location}
        classes={classes}
      />
    </PromisedContentWrapper>
  );
}

export const Switcher = ({ accessibleProjects, currentProject, location, classes }) => (
  <TextField
    className={classes.switcher}
    label="Current Project"
    variant="outlined"
    margin="dense"
    fullWidth
    select
    value={currentProject.value}
  >
    {getDropdownContent(accessibleProjects, location, classes)}
  </TextField>
);

function getDropdownContent(accessibleProjects, location, classes) {
  if (accessibleProjects.fetching) {
    return <div className={classes.dropdownProgress}><CircularProgress /></div>;
  }

  if (accessibleProjects.value.length === 0) {
    return <MenuItem>No Projects Accessible</MenuItem>;
  }

  return accessibleProjects.value.map(project => (
    <MenuItem component={Link} value={project.key} key={project.key} to={createRoute(location, project.key)}>
      {project.name}
    </MenuItem>
  ));
}

export default withStyles(style)(ProjectSwitcher);
