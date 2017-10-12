import React from 'react';
import { Header, Segment } from 'semantic-ui-react';
import SiteContainer from '../containers/sites/SitesContainer';

const PublishingPage = () => (
  <Segment basic>
    <Header as="h1">Published Sites</Header>
    <SiteContainer />
  </Segment>
);

export default PublishingPage;
