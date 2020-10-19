import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from './ResourceAccordion';
import { ProjectDataStorageContainer } from '../dataStorage/DataStorageContainer';

export default function ProjectStorage(props) {
  const { project, userPermissions } = props;
  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Storage</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectDataStorageContainer userPermissions={userPermissions} projectKey={project.key} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
