import React from 'react';
import PropTypes from 'prop-types';

const PromisedContentSkeletonWrapper = ({ promises, skeletonComponent, skeletonProps = {}, children }) => {
  const fetching = Array.isArray(promises) ? promises.some(item => item.fetching) : promises.fetching;

  if (fetching) return React.createElement(skeletonComponent, skeletonProps);
  return children;
};

const promisePropTypes = PropTypes.shape({
  fetching: PropTypes.bool.isRequired,
});

PromisedContentSkeletonWrapper.propTypes = {
  promises: PropTypes.oneOfType([
    promisePropTypes.isRequired,
    PropTypes.arrayOf(promisePropTypes).isRequired,
  ]),
  skeletonComponent: PropTypes.oneOfType([
    PropTypes.node.isRequired,
    PropTypes.elementType.isRequired,
  ]),
  skeletonProps: PropTypes.object,
};

export default PromisedContentSkeletonWrapper;
