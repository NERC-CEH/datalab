import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { sortBy } from 'lodash';
import withStyles from '@mui/styles/withStyles';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import { useProjectsArray } from '../../hooks/projectsHooks';
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
    minHeight: 60,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropdownProgress: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
  },
  itemContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  itemKey: {
    color: theme.typography.colorLight,
    fontSize: '0.75em',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
});

export function createRoute(location, projectKey) {
  const pattern = new RegExp('/projects/.*?/');
  return location.pathname.replace(pattern, `/projects/${projectKey}/`);
}

export function getSwitcherProjects(projects, currentProject) {
  if (projects.fetching || currentProject.fetching) {
    return { ...projects, value: [] };
  }

  const accessible = projects.value.filter(item => item.accessible);
  if (currentProject.value.key && !accessible.map(item => item.key).includes(currentProject.value.key)) {
    accessible.push(currentProject.value);
  }

  return {
    ...projects,
    value: accessible,
  };
}

function ProjectSwitcher({ classes }) {
  const currentProject = useCurrentProject();
  const projects = useProjectsArray();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (currentProject.value && currentProject.value.key) {
      dispatch(projectsActions.loadProjects());
    }
  }, [dispatch, currentProject.value]);

  const switcherProjects = getSwitcherProjects(projects, currentProject);
  switcherProjects.value = sortBy(
    switcherProjects.value,
    project => `${project.name} ${project.key}`.toLowerCase(),
  );

  return (
    <PromisedContentWrapper
      className={classes.promisedContent}
      promise={{ fetching: currentProject.fetching || !currentProject.value.key }}
    >
      <Switcher
        switcherProjects={switcherProjects}
        currentProject={currentProject}
        location={location}
        classes={classes}
      />
    </PromisedContentWrapper>
  );
}

export const Switcher = ({ switcherProjects, currentProject, location, classes }) => (
  <TextField
    className={classes.switcher}
    label="Current Project"
    variant="outlined"
    margin="dense"
    fullWidth
    select
    value={!switcherProjects.fetching && currentProject.value ? currentProject.value.key : ''}
  >
    {getDropdownContent(switcherProjects, location, classes)}
  </TextField>
);

function getDropdownContent(switcherProjects, location, classes) {
  if (switcherProjects.fetching) {
    return <div className={classes.dropdownProgress}><CircularProgress /></div>;
  }

  if (switcherProjects.value.length === 0) {
    return <MenuItem>No Projects Accessible</MenuItem>;
  }

  return switcherProjects.value.map(project => (
    <MenuItem component={Link} value={project.key} key={project.key} to={createRoute(location, project.key)}>
      <div className={classes.itemContent}>
        <Typography variant="body1" noWrap>{`${project.name}`}</Typography>
        <Typography className={classes.itemKey}>{`(${project.key})`}</Typography>
      </div>
    </MenuItem>
  ));
}

export default withStyles(style)(ProjectSwitcher);
