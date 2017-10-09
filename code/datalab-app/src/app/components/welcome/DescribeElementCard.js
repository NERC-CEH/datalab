import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Icon from 'material-ui/Icon';
import Typography from 'material-ui/Typography';

const cardStyle = {
  height: '100%',
};

const bodyText = {
  fontSize: 'larger',
  fontWeight: 'lighter',
};

const cardTitle = {
  fontWeight: 'lighter',
};

const styles = theme => ({
  card: {
    ...cardStyle,
    backgroundColor: theme.palette.secondary[50],
  },
  invertCard: cardStyle,
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
  bodyText,
  quoteBodyText: {
    ...bodyText,
    fontStyle: 'italic',
  },
  cardImage: {
    height: 90,
    marginBottom: 8,
  },
});

function DescribeElementCard({ classes, icon, title, content, invert, quote, media }) {
  const banner = (
    <CardContent key="card-title">
      {icon ? <Icon className={classes.icon}>{icon}</Icon> : undefined}
      <Typography className={icon ? classes.iconCardTitle : classes.cardTitle} type="headline">
        {title}
      </Typography>
    </CardContent>
  );

  const generateTextBody = textContent => (
    <CardContent key="card-body">
      <Typography className={quote ? classes.quoteBodyText : classes.bodyText} type="body1">
        {textContent}
      </Typography>
    </CardContent>
  );

  const generateMediaBody = mediaContent => (
    <CardMedia className={classes.cardImage} key="card-body" image={mediaContent} />
  );

  const body = media ? generateMediaBody(content) : generateTextBody(content);

  let cardContent = [banner, body];

  if (quote) {
    cardContent = cardContent.reverse();
  }

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={invert ? classes.invertCard : classes.card} square>
        {cardContent}
      </Card>
    </Grid>
  );
}

export default withStyles(styles)(DescribeElementCard);
