import React from 'react';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ProjectNotebooks from './ProjectNotebooks';
import ProjectSites from './ProjectSites';
import ProjectStorage from './ProjectStorage';
import { ResourceAccordion, ResourceAccordionSummary, ResourceAccordionDetails } from './ResourceAccordion';

const resourcesStyle = {
  marginLeft: '40px',
};

const headingStyle = {
  margin: '10px 0 10px 0',
};

export default function ProjectResources(props) {
  const { userPermissions, project, show } = props;
  return (
    <ResourceAccordion key={project.key} defaultExpanded>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h5" style={headingStyle}>{project.name}</Typography>
      </ResourceAccordionSummary>
      <ResourceAccordionDetails>
        <div style={resourcesStyle}>
          {show.notebooks && ProjectNotebooks({ userPermissions, project })}
          {show.sites && ProjectSites({ userPermissions, project })}
          {show.storage && ProjectStorage({ userPermissions, project })}
        </div>
      </ResourceAccordionDetails>
    </ResourceAccordion>
  );
}
