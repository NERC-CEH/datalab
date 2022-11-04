import React from 'react';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
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
