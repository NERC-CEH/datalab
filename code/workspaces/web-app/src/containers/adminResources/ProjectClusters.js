import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
import ProjectClustersContainer from '../clusters/ProjectClustersContainer';
import { DASK_CLUSTER_TYPE } from '../clusters/clusterTypeName';

export default function ProjectClusters(props) {
  const { project, userPermissions } = props;
  const showCreateButton = false;

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Clusters</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <ProjectClustersContainer clusterType={DASK_CLUSTER_TYPE} userPermissions={userPermissions} projectKey={project.key} showCreateButton={showCreateButton} />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
