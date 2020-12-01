import React from 'react';
import theme from '../../../theme';

const style = {
  fontWeight: 200,
  letterSpacing: '0.05em',
  color: theme.typography.colorLight,
  textTransform: 'uppercase',
};

const ResourceInfoSpan = ({ className, children }) => (
  <span className={className} style={style}>{children}</span>
);

export default ResourceInfoSpan;
