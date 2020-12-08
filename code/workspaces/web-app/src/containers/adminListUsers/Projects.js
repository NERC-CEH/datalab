import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import StackCards from '../../components/stacks/StackCards';
import { PROJECT_OPEN_PERMISSION, projectToStack } from '../projects/ProjectsContainer';
import { PROJECT_TYPE_NAME } from '../projects/projectTypeName';

function Projects({ projects, history }) {
  const stacks = {
    fetching: false,
    error: null,
    value: projects.map(projectToStack),
  };

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{PROJECT_TYPE_NAME}</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <StackCards
          stacks={stacks}
          typeName={PROJECT_TYPE_NAME}
          userPermissions={() => [PROJECT_OPEN_PERMISSION]}
          openStack={proj => history.push(`/projects/${proj.key}/info`)}
          openCreationForm={() => {}}
          deleteStack={() => { }}
          createPermission=""
          openPermission={PROJECT_OPEN_PERMISSION}
          deletePermission=""
          editPermission=""
        />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}

export { Projects as PureProjects }; // export for testing
export default (withRouter(Projects));
