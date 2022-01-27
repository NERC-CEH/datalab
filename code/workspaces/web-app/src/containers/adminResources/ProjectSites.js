import React from 'react';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
import ProjectSitesContainer from './ProjectSitesContainer';

export default function ProjectSites(props) {
  const { project, userPermissions } = props;

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Sites</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectSitesContainer userPermissions={userPermissions} project={project} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
