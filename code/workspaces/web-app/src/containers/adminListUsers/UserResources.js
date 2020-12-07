import React from 'react';
import { useDispatch } from 'react-redux';
import Checkbox from '@material-ui/core/Checkbox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import { permissionTypes } from 'common';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import userSummary from './userSummary';
import projectsToShow from './projectsToShow';
import UserProject from './UserProject';
import Pagination from '../../components/stacks/Pagination';
import roleActions from '../../actions/roleActions';

const { CATALOGUE_ROLES } = permissionTypes;

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
  placeHolderCard: {
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
  const dispatch = useDispatch();
  const classes = useStyles();

  if (!roles) {
    return null;
  }
  const projects = projectsToShow(filters, roles);

  const renderedProjects = projects && projects.length > 0
    ? projects.map(projectKey => <UserProject key={projectKey} userId={user.userId} projectKey={projectKey} filters={filters} roles={roles} />)
    : [<div className={classes.placeHolderCard} key={'place-holder-card'}>
      <Typography variant="body1">No projects to display.</Typography>
    </div>];

  const handleSystemCheckbox = (event) => {
    dispatch(roleActions.setInstanceAdmin(user.userId, event.target.checked));
  };

  const handleSystemSelect = (event) => {
    dispatch(roleActions.setCatalogueRole(user.userId, event.target.value));
  };

  const SystemCheckbox = ({ label, checked, name }) => {
    const id = `system-checkbox-${user.userId}-${name}`;
    return (
      <>
        <Typography id={id} variant="body1">{label}</Typography>
        <Checkbox checked={checked} onChange={handleSystemCheckbox} name={name} color="primary" aria-labelledby={id} />
      </>
    );
  };

  const SystemSelect = ({ itemPrefix, current, items, name }) => (
      <div className={classes.systemSelect}>
        <Select value={current} onChange={handleSystemSelect} name={name} color="primary" variant="outlined" margin="dense" aria-label={`${itemPrefix} role`}>
          {items.map(item => (
            <MenuItem key={item} value={item}>{itemPrefix} {item}</MenuItem>
          ))}
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
              <SystemSelect itemPrefix="Catalogue" current={roles.catalogueRole} items={CATALOGUE_ROLES} name="catalogue" />
            </div>
            <Pagination items={renderedProjects} itemsPerPage={5} itemsName="Projects" />
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
