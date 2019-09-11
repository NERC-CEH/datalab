import React from 'react';
import PropTypes from 'prop-types';
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

InfoPage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      projectKey: PropTypes.string.isRequired,
    }),
  }).isRequired,
};

export default InfoPage;
