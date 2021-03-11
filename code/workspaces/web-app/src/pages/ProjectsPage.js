import React from 'react';
import PropTypes from 'prop-types';
import ProjectsContainer from '../containers/projects/ProjectsContainer';
import Page from './Page';

const ProjectsPage = ({ userPermissions }) => (
  <Page title="Projects">
    <ProjectsContainer userPermissions={userPermissions}/>
  </Page>
);

ProjectsPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default ProjectsPage;
