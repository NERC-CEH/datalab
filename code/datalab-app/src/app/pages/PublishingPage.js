import React from 'react';
import Typography from 'material-ui/Typography';
import Segment from '../components/app/Segment';
import SiteContainer from '../containers/sites/SitesContainer';

const PublishingPage = () => (
  <Segment>
    <Typography gutterBottom type="display1">Published Sites</Typography>
    <SiteContainer />
  </Segment>
);

export default PublishingPage;
