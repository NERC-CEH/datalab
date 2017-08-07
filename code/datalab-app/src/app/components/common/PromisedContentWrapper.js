import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

const PromisedContentWrapper = ({ children, promise }) => {
  const isFetching = promise.fetching;
  return (
    <div>
      <Loader active={isFetching} inline='centered' />
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

export default PromisedContentWrapper;
