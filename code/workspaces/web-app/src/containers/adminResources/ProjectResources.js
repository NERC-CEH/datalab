import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';
import ProjectNotebooks from './ProjectNotebooks';
import ProjectSites from './ProjectSites';
import ProjectClusters from './ProjectClusters';
import ProjectStorage from './ProjectStorage';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';

const useContainerStyles = makeStyles(theme => ({
  root: {
    marginBottom: theme.spacing(10),
  },
}));

const useResourcesStyles = makeStyles(theme => ({
  root: {
    marginLeft: theme.spacing(8),
  },
}));

const useHeadingStyles = makeStyles(theme => ({
  root: {
    margin: `${theme.spacing(2)}, 0`,
  },
}));

export default function ProjectResources(props) {
  const classesContainer = useContainerStyles();
  const classesResources = useResourcesStyles();
  const classesHeading = useHeadingStyles();
  const { userPermissions, project, show } = props;
  return (
    <div className={classesContainer.root}>
      <ResourceAccordion key={project.key} defaultExpanded>
        <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h5" className={classesHeading.root}>{project.name}</Typography>
        </ResourceAccordionSummary>
        <ResourceAccordionDetails>
          <div className={classesResources.root}>
            {show.notebooks && ProjectNotebooks({ userPermissions, project })}
            {show.sites && ProjectSites({ userPermissions, project })}
            {show.clusters && ProjectClusters({ userPermissions, project })}
            {show.storage && ProjectStorage({ userPermissions, project })}
          </div>
        </ResourceAccordionDetails>
      </ResourceAccordion>
    </div>
  );
}
