import React from 'react';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  root: {
    fontWeight: 200,
    letterSpacing: '0.05em',
    color: theme.typography.body2.color,
    textTransform: 'uppercase',
  },
}));

const ResourceInfoSpan = ({ className = '', children }) => {
  const classes = useStyles();
  const totalClassName = `${className} ${classes.root}`;
  return (
    <span className={totalClassName}>{children}</span>
  );
};

export default ResourceInfoSpan;
