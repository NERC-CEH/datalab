import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import ProjectNotebooks from './ProjectNotebooks';
import ProjectSites from './ProjectSites';
import ProjectStorage from './ProjectStorage';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';

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
}));

export default function ProjectResources(props) {
  const classes = useStyles();
  const { userPermissions, project, show } = props;
  return (
    <div className={classes.container}>
      <ResourceAccordion key={project.key} defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classes.heading}>{project.name}</Typography>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classes.resources}>
            {show.notebooks && ProjectNotebooks({ userPermissions, project })}
            {show.sites && ProjectSites({ userPermissions, project })}
            {show.storage && ProjectStorage({ userPermissions, project })}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
