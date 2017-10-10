import React from 'react';
import { withStyles } from 'material-ui/styles';
import { CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

const cardTitle = {
  fontWeight: 'lighter',
};

const styles = theme => ({
  cardTitle,
  iconCardTitle: {
    ...cardTitle,
    marginLeft: 35,
  },
  icon: {
    color: theme.palette.error[900],
    float: 'left',
    paddingTop: 3,
  },
});

const DescribeElementCardBanner = ({ classes, icon, title }) => (
  <CardContent>
    {icon ? <Icon className={classes.icon}>{icon}</Icon> : undefined}
    <Typography className={icon ? classes.iconCardTitle : classes.cardTitle} type="headline">
      {title}
    </Typography>
  </CardContent>
);

export default withStyles(styles)(DescribeElementCardBanner);
