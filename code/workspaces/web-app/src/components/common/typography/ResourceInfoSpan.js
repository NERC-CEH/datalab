import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import theme from '../../../theme';

const useStyles = makeStyles(t => ({
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
