import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

const cardStyle = {
  height: '100%',
};

const bodyStyle = {
  fontSize: 'larger',
  fontWeight: 'lighter',
};

const styles = theme => ({
  card: {
    ...cardStyle,
    backgroundColor: theme.palette.secondary[50],
  },
  invertCard: cardStyle,
  cardTitle: {
    marginLeft: 35,
    fontWeight: 'lighter',
  },
  icon: {
    color: theme.palette.error[900],
    float: 'left',
    paddingTop: 3,
  },
  body: bodyStyle,
  quoteBody: {
    ...bodyStyle,
    fontStyle: 'italic',
  },
});

function DescribeElementCard({ classes, description, invert, quote }) {
  const title = (
    <CardContent key="card-title">
      <Icon className={classes.icon}>{description.icon}</Icon>
      <Typography className={classes.cardTitle} type="headline">{description.title}</Typography>
    </CardContent>
  );

  const body = (
    <CardContent key="card-body">
        <Typography className={quote ? classes.quoteBody : classes.body} type="body1">{description.supportingText}</Typography>
    </CardContent>
  );

  let content = [title, body];

  if (quote) {
    content = content.reverse();
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={invert ? classes.invertCard : classes.card} square>
        {content}
      </Card>
    </Grid>
  );
}

export default withStyles(styles)(DescribeElementCard);
