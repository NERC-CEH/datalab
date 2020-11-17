import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';
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
  instanceAdmin: {
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
  },
}));

export default function UserResources(props) {
  const classes = useStyles();
  const { user, filters, roles } = props;

  if (!roles) { return null; }
  const projects = projectsToShow(filters, roles);

  const renderedProjects = projects && projects.length > 0
    ? projects.map(projectKey => <UserProject key={projectKey} projectKey={projectKey} filters={filters} roles={roles} />)
    : [<div className={classes.placeholderCard} key={'placeholder-card'}>
      <Typography variant="body1">No projects to display.</Typography>
    </div>];

  return (
    <div className={classes.container}>
      <ResourceAccordion defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <div className={classes.summary}>
            <Typography variant="h5" className={classes.heading}>{user.name}</Typography>
            <Typography variant="body2">{userSummary(filters, roles)}</Typography>
          </div>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            <div className={classes.instanceAdmin}>
              <Typography variant="body1">Instance admin</Typography>
              <Checkbox checked={roles.instanceAdmin} name="instanceAdmin" color="primary" disabled />
            </div>
            <Pagination items={renderedProjects} itemsPerPage={5} itemsName="Projects" />
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
