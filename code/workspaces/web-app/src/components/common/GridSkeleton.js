import React from 'react';
import PropTypes from 'prop-types';
import Skeleton from '@material-ui/lab/Skeleton';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => {
  const horizontalSpacing = theme.spacing(3);
  const verticalSpacing = theme.spacing(1);

  return {
    grid: {
      display: 'grid',
      gridTemplateColumns: ({ columns }) => `repeat(${columns}, 1fr)`,
      rowGap: `${verticalSpacing}px`,
      columnGap: `${horizontalSpacing}px`,
      margin: [[verticalSpacing, 0]],
    },
  };
});

const GridSkeleton = ({ rows = 3, columns = 3, sizingText = 'Text to infer size from', sizingTextVariant = 'body1', className }) => {
  const classes = useStyles({ columns });

  const contents = [];
  for (let i = 0; i < rows * columns; i++) {
    contents.push(
      <Skeleton key={i} variant="text">
        <Typography variant={sizingTextVariant}>{sizingText}</Typography>
      </Skeleton>,
    );
  }

  const finalClassName = constructClassName(classes.grid, className);
  return <div className={finalClassName}>{contents}</div>;
};

GridSkeleton.propTypes = {
  rows: PropTypes.number,
  columns: PropTypes.number,
  sizingText: PropTypes.string,
  sizingTextVariant: PropTypes.oneOf([ // The Material UI Typography variants
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'subtitle1', 'subtitle2',
    'body1', 'body2',
    'caption', 'button', 'overline', 'srOnly', 'inherit',
  ]),
  className: PropTypes.string,
};

const constructClassName = (...classNames) => (
  classNames
    .filter(name => name) // remove falsy values
    .join(' ')
);

export default GridSkeleton;
