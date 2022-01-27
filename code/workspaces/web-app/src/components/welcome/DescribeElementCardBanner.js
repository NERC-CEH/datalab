import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import Icon from '@mui/material/Icon';
import Typography from '@mui/material/Typography';
import theme from '../../theme';

const contentContainer = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  margin: `${theme.spacing(2)} 0`,
};

const styles = injectedTheme => ({
  cardTitle: {
    fontWeight: 'lighter',
    margin: 0,
    color: 'inherit',
  },
  contentContainer,
  quoteContentContainer: {
    alignSelf: 'flex-end',
    color: injectedTheme.typography.colorLight,
  },
  icon: {
    color: injectedTheme.palette.backgroundDarkTransparent,
  },
  iconContainer: {
    background: injectedTheme.palette.backgroundDarkHighTransparent,
    borderRadius: 50, // large so div is round
    padding: injectedTheme.spacing(2),
    marginRight: injectedTheme.spacing(4),
    display: 'flex',
  },
});

const DescribeElementCardBanner = ({ classes, icon, title, quote }) => (
  <div className={quote ? classes.quoteContentContainer : classes.contentContainer}>
    {icon ? <div className={classes.iconContainer}><Icon className={classes.icon}>{icon}</Icon></div> : undefined}
    <Typography className={classes.cardTitle} variant="h5">
      {title}
    </Typography>
  </div>
);

DescribeElementCardBanner.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  quote: PropTypes.bool,
};

export default withStyles(styles)(DescribeElementCardBanner);
