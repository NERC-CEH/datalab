import React from 'react';
import ProptTypes from 'prop-types';
import ProjectsContainer from '../containers/projects/ProjectsContainer';
import Page from './Page';

const ProjectsPage = ({ userPermissions }) => (
  <Page title="Projects">
    <ProjectsContainer userPermissions={userPermissions}/>
  </Page>
);

ProjectsPage.propTypes = {
  userPermissions: ProptTypes.arrayOf(ProptTypes.string).isRequired,
};

export default ProjectsPage;
