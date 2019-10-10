import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

const PromisedContentWrapper = ({ children, promise, className }) => {
  const isFetching = promise.fetching;
  return (
    <div className={className}>
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
    value: PropTypes.any,
  }).isRequired,
};

export default PromisedContentWrapper;
