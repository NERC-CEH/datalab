import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles(() => ({
  fullSizeBase: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  fullHeight: {
    height: '100%',
  },
}));

const PromisedContentWrapper = ({ children, promise, className, fetchingClassName, fullWidth = true, fullHeight = false, loadingSize = 40 }) => {
  let isFetching = false;

  if (Array.isArray(promise)) {
    isFetching = promise.map(item => item.fetching).includes(true);
  } else {
    isFetching = promise.fetching;
  }

  const content = isFetching ? <CircularProgress size={loadingSize}/> : children;

  const classWrapper = className || (isFetching && fetchingClassName)
    ? (
      <ClassWrapper isFetching={isFetching} className={className} fetchingClassName={fetchingClassName}>
        {content}
      </ClassWrapper>
    )
    : content;

  return isFetching && (fullWidth || fullHeight)
    ? (
      <SizeWrapper fullWidth={fullWidth} fullHeight={fullHeight}>
        {classWrapper}
      </SizeWrapper>
    )
    : classWrapper;
};

export const ClassWrapper = ({ isFetching, className, fetchingClassName, children }) => {
  const finalClassName = createClassName(
    className,
    isFetching && fetchingClassName,
  );

  return (
    <div className={finalClassName}>
      {children}
    </div>
  );
};

export const SizeWrapper = ({ fullWidth, fullHeight, children }) => {
  const classes = useStyles();

  const sizeClassName = createClassName(
    fullWidth || fullHeight ? classes.fullSizeBase : undefined,
    fullWidth ? classes.fullWidth : undefined,
    fullHeight ? classes.fullHeight : undefined,
  );

  return <div className={sizeClassName}>{children}</div>;
};

export const createClassName = (...names) => names.filter(item => !!item).join(' ');

const promiseType = PropTypes.shape({
  error: PropTypes.shape({
    message: PropTypes.string,
  }),
  fetching: PropTypes.bool.isRequired,
  value: PropTypes.any,
});

PromisedContentWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  promise: PropTypes.oneOfType([
    PropTypes.arrayOf(promiseType),
    promiseType,
  ]).isRequired,
  className: PropTypes.string,
  fetchingClassName: PropTypes.string,
  fullWidth: PropTypes.bool,
  fullHeight: PropTypes.bool,
  loadingSize: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
};

export default PromisedContentWrapper;
