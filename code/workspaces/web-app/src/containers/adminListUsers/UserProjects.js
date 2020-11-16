import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { withRouter } from 'react-router-dom';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import StackCards from '../../components/stacks/StackCards';
import { TYPE_NAME, PROJECT_OPEN_PERMISSION, projectToStack } from '../projects/ProjectsContainer';

function UserProjects(props) {
  const { projects, userPermissions, history } = props;
  const stacks = {
    fetching: false,
    error: null,
    value: projects.map(projectToStack),
  };

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Project</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <StackCards
          stacks={stacks}
          userPermissions={() => [PROJECT_OPEN_PERMISSION, ...userPermissions]}
          typeName={TYPE_NAME}
          openStack={proj => history.push(`/projects/${proj.key}/info`)}
          openPermission={PROJECT_OPEN_PERMISSION}
          deletePermission=""
          editPermission=""
        />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}

export default (withRouter(UserProjects));
