import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { withStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import useCurrentProject from '../../hooks/useCurrentProject';
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
    minHeight: 50,
    display: 'flex',
    justifyContent: 'center',
    margin: `${theme.spacing(2)}px 0`,
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
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(projectsActions.loadProjects());
  }, [dispatch]);

  const currentProject = useCurrentProject();
  const projects = useProjectsArray();
  const { location } = window;

  const switcherProjects = getSwitcherProjects(projects, currentProject);

  return (
    <PromisedContentWrapper
      className={classes.promisedContent}
      promise={{ fetching: currentProject.fetching || !currentProject.value.key }}>
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
    value={currentProject.value && currentProject.value.key}
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
