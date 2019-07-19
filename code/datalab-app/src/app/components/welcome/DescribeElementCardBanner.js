import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import Icon from '@material-ui/core/Icon';
import Typography from '@material-ui/core/Typography';

const cardTitle = {
  fontWeight: 'lighter',
};

const styles = theme => ({
  cardTitle,
  tallCardTitle: {
    ...cardTitle,
    minHeight: theme.spacing.unit * 8,
  },
  icon: {
    color: theme.palette.error[900],
    paddingTop: 3,
    marginRight: 35,
  },
});

const DescribeElementCardBanner = ({ classes, icon, title, doubleHeight }) => (
  <CardContent>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      {icon ? <Icon className={classes.icon}>{icon}</Icon> : undefined}
      <Typography className={doubleHeight ? classes.tallCardTitle : classes.cardTitle} type="headline">
        {title}
      </Typography>
    </div>
  </CardContent>
);

DescribeElementCardBanner.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  doubleHeight: PropTypes.bool,
};

export default withStyles(styles)(DescribeElementCardBanner);
