import React from 'react';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
import ProjectNotebooksContainer from './ProjectNotebooksContainer';

export default function ProjectNotebooks(props) {
  const { project, userPermissions } = props;

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Notebooks</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectNotebooksContainer userPermissions={userPermissions} project={project} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
