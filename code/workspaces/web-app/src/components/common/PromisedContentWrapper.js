import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';

const PromisedContentWrapper = ({ children, promise, fetchingClassName, completeClassName }) => (
  promise.fetching
    ? <div className={fetchingClassName}><CircularProgress /></div>
    : <div className={completeClassName}>{children}</div>
);

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
