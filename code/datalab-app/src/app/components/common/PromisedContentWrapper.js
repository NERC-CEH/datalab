import React from 'react';
import PropTypes from 'prop-types';
import { CircularProgress } from '@material-ui/core/Progress';

const PromisedContentWrapper = ({ children, promise }) => {
  const isFetching = promise.fetching;
  return (
    <div>
      {isFetching ? <CircularProgress /> : children}
    </div>
  );
};

PromisedContentWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  promise: PropTypes.shape({
    error: PropTypes.shape({
      message: PropTypes.string,
    }),
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.any.isRequired,
  }).isRequired,
};

export default PromisedContentWrapper;
