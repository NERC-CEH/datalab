import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Segment from '../components/app/Segment';
import SiteContainer from '../containers/sites/SitesContainer';

const PublishingPage = ({ userPermissions }) => (
  <Segment>
    <Typography gutterBottom type="display1">Published Sites</Typography>
    <SiteContainer userPermissions={userPermissions} />
  </Segment>
);

PublishingPage.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default PublishingPage;
