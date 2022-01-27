import React from 'react';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
import ProjectClustersContainer from '../clusters/ProjectClustersContainer';

export default function ProjectClusters(props) {
  const { project, userPermissions } = props;
  const modifyData = false;

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Clusters</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectClustersContainer userPermissions={userPermissions} projectKey={project.key} modifyData={modifyData} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
