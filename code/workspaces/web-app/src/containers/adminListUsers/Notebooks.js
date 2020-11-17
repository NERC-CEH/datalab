import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import StackCards from '../../components/stacks/StackCards';
import { TYPE_NAME } from '../notebooks/NotebooksContainer';

function Notebooks(props) {
  const { notebooks } = props;
  const stacks = {
    fetching: false,
    error: null,
    value: notebooks,
  };

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Notebooks</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <StackCards
          stacks={stacks}
          typeName={TYPE_NAME}
          userPermissions={() => []}
          openStack={() => { }}
          openCreationForm={() => { }}
          deleteStack={() => { }}
          createPermission=""
          openPermission=""
          deletePermission=""
          editPermission=""
        />
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}

export default Notebooks;
