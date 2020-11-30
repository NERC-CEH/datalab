import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import userSummary from './userSummary';
import projectsToShow from './projectsToShow';
import UserProject from './UserProject';
import Pagination from '../../components/stacks/Pagination';

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
  systemRoles: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  placeholderCard: {
    width: '100%',
    height: 70,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderTop: `1px solid ${theme.palette.divider}`,
    borderBottom: `1px solid ${theme.palette.divider}`,
    marginTop: theme.spacing(2),
  },
  systemSelect: {
    marginLeft: theme.spacing(2),
  },
}));

export default function UserResources({ user, filters, roles }) {
  const classes = useStyles();

  if (!roles) {
    return null;
  }
  const projects = projectsToShow(filters, roles);

  const renderedProjects = projects && projects.length > 0
    ? projects.map(projectKey => <UserProject key={projectKey} userId={user.userId} projectKey={projectKey} filters={filters} roles={roles} />)
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
      <Typography variant="body1">No projects to display.</Typography>
    </div>];

  const SystemCheckbox = ({ label, checked, name }) => {
    const id = `system-checkbox-${user.userId}-${name}`;
    return (
      <>
        <Typography id={id} variant="body1">{label}</Typography>
        <Checkbox checked={checked} name={name} color="primary" disabled aria-labelledby={id} />
      </>
    );
  };

  const SystemSelect = ({ label, current, name }) => (
      <div className={classes.systemSelect}>
        <Select value={current} name={name} color="primary" variant="outlined" margin="dense" disabled>
          <MenuItem value={current}>{label} {current}</MenuItem>
        </Select>
      </div>
  );

  return (
    <div className={classes.container}>
      <ResourceAccordion>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.summary}>
            <Typography variant="h5" className={classes.heading}>{user.name}</Typography>
            <Typography variant="body2">{userSummary(filters, roles)}</Typography>
          </div>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            <div className={classes.systemRoles}>
              <SystemCheckbox label="Instance admin" checked={roles.instanceAdmin} name="instanceAdmin" />
              <SystemSelect label="Catalogue" current={roles.catalogueRole} name="catalogue" />
            </div>
            <Pagination items={renderedProjects} itemsPerPage={5} itemsName="Projects" />
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
