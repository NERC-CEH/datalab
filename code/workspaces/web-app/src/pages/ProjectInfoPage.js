import React from 'react';
import PropTypes from 'prop-types';
import Page from './Page';
import ProjectInfoContainer from '../containers/projectInfo/ProjectInfoContainer';

const ProjectInfoPage = ({ match }) => (
  <Page title="Information">
    <ProjectInfoContainer projectKey={match.params.projectKey} />
  </Page>
);

ProjectInfoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default ProjectInfoPage;
