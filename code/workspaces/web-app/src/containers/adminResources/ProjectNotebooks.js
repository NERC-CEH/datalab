import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from './ResourceAccordion';
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
