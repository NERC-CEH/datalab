import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

const styles = theme => ({
  container: {
    maxWidth: 1024,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  title: {
    paddingTop: 28,
    paddingBottom: 28,
  },
  card: {
    height: '100%',
    backgroundColor: theme.palette.secondary[50],
  },
  cardTitle: {
    marginLeft: 35,
    fontWeight: 'lighter',
  },
  icon: {
    color: theme.palette.error[900],
    float: 'left',
    paddingTop: 3,
  },
  cardBody: {
    fontSize: 'larger',
    fontWeight: 'lighter',
  },
});

const DescribeElement = ({ classes, title, descriptions }) => (
  <div className={classes.container}>
    <Typography className={classes.title} type="display1">{title}</Typography>
    <Grid container align="stretch">
      {descriptions.map((description, idx) => (
        <Grid item xs={12} sm={6} md={4} key={`card-${idx}`}>
          <Card className={classes.card} square>
            <CardContent>
              <Icon className={classes.icon}>{description.icon}</Icon>
              <Typography className={classes.cardTitle} type="headline">{description.title}</Typography>
            </CardContent>
            <CardContent>
              <Typography className={classes.cardBody} type="body1">{description.supportingText}</Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  </div>
);

export default withStyles(styles)(DescribeElement);
