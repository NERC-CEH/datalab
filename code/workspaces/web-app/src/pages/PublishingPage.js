import React from 'react';
import PropTypes from 'prop-types';
import SiteContainer from '../containers/sites/SitesContainer';
import Page from './Page';

const PublishingPage = ({ userPermissions, match }) => (
  <Page title="Sites">
    <SiteContainer userPermissions={userPermissions} projectKey={match.params.projectKey} />
  </Page>
);

PublishingPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
};

export default PublishingPage;
