import React from 'react';
import Page from './Page';

const InfoPage = ({ match }) => (
  <Page title="Information">
    <div>
      This is the project information page.
    </div>
    <div>
      The projectKey is {match.params.projectKey}
    </div>
  </Page>
);

export default InfoPage;
