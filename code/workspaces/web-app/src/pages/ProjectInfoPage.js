import React from 'react';
import Page from './Page';
import ProjectInfoContainer from '../containers/projectInfo/ProjectInfoContainer';

const ProjectInfoPage = ({ match }) => (
  <Page title="Information">
    <ProjectInfoContainer />
  </Page>
);

export default ProjectInfoPage;
