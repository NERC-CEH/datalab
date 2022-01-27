import React from 'react';
import PropTypes from 'prop-types';
import makeStyles from '@mui/styles/makeStyles';
import CircularProgress from '@mui/material/CircularProgress';

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
  const isFetching = isPromiseFetching(promise);
  const content = isFetching ? <CircularProgress size={loadingSize}/> : children;
  const classWrapper = getClassWrappedContent(content, isFetching, className, fetchingClassName);
  return getSizeWrappedContent(classWrapper, isFetching, fullWidth, fullHeight);
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

const isPromiseFetching = (promise) => {
  if (Array.isArray(promise)) {
    return promise.map(item => item.fetching).includes(true);
  }

  return promise.fetching;
};

const getClassWrappedContent = (content, isFetching, className, fetchingClassName) => (
  className || (isFetching && fetchingClassName)
    ? (
      <ClassWrapper isFetching={isFetching} className={className} fetchingClassName={fetchingClassName}>
        {content}
      </ClassWrapper>
    )
    : content
);

const getSizeWrappedContent = (content, isFetching, fullWidth, fullHeight) => (
  isFetching && (fullWidth || fullHeight)
    ? (
      <SizeWrapper fullWidth={fullWidth} fullHeight={fullHeight}>
        {content}
      </SizeWrapper>
    )
    : content
);

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
