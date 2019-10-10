import React from 'react';
import PropTypes from 'prop-types';
import SiteContainer from '../containers/sites/SitesContainer';
import Page from './Page';

const PublishingPage = ({ userPermissions }) => (
  <Page title="Sites">
    <SiteContainer userPermissions={userPermissions} />
  </Page>
);

PublishingPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PublishingPage;
