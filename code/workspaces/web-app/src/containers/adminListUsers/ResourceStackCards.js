import React from 'react';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../../components/common/ResourceAccordion';
import StackCards from '../../components/stacks/StackCards';

function ResourceStackCards({ resources, typeName, typeNamePlural }) {
  const stacks = {
    fetching: false,
    error: null,
    value: resources,
  };

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">{typeNamePlural}</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <StackCards
          stacks={stacks}
          typeName={typeName}
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

export default ResourceStackCards;
