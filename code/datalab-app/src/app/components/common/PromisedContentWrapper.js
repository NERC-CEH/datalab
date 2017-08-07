import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

const PromisedContentWrapper = ({ children, promise }) => {
  const isFetching = checkIfFetching(promise);
  return (
    <div>
      <Loader active={isFetching !== undefined} inline='centered' />
      {isFetching ? null : children}
    </div>
  );
};

PromisedContentWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  promise: PropTypes.shape({
    error: PropTypes.string,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
};

function checkIfFetching({ fetching }) {
  if (fetching) {
    return 'LOADING';
  }
  return undefined;
}

export default PromisedContentWrapper;
