import React from 'react';
import PropTypes from 'prop-types';
import { Typography } from '@mui/material';

const ProjectInfoContent = ({ projectInfo }) => (
  <div>
    <Typography variant='h5'>{projectInfo.key}: {projectInfo.name}</Typography>
    <Typography variant='body1'>
      {projectInfo.description}
    </Typography>
  </div>
);

ProjectInfoContent.propTypes = {
  projectInfo: PropTypes.shape({
    id: PropTypes.string,
    displayName: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default ProjectInfoContent;
