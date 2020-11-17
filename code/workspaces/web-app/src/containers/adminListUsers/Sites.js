import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from '../adminResources/ResourceAccordion';
import StackCards from '../../components/stacks/StackCards';
import { TYPE_NAME } from '../sites/SitesContainer';

function Sites(props) {
  const { sites } = props;
  const stacks = {
    fetching: false,
    error: null,
    value: sites,
  };

  return (
    <ResourceAccordion defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h6">Sites</Typography>
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

export default Sites;
