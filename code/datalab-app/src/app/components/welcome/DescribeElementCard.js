import React from 'react';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Card from 'material-ui/Card';
import DescribeElementCardBanner from './DescribeElementCardBanner';
import DescribeElementCardBody from './DescribeElementCardBody';
import DescribeElementCardLinks from './DescribeElementCardLinks';

const cardStyle = {
  height: '100%',
};

const styles = theme => ({
  card: {
    ...cardStyle,
    backgroundColor: theme.palette.secondary[50],
  },
  invertCard: cardStyle,
});

function DescribeElementCard({ classes, icon, title, content, links, invert, quote, media }) {
  const banner = (<DescribeElementCardBanner key="card-banner" icon={icon} title={title} />);
  const body = (<DescribeElementCardBody key="card-body" content={content} media={media} quote={quote} />);
  const actions = links ? (<DescribeElementCardLinks key="card-links" links={links} />) : undefined;

  let cardContent = [banner, body];

  if (quote) {
    cardContent = cardContent.reverse();
  }

  cardContent.push(actions);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={invert ? classes.invertCard : classes.card} square>
        {cardContent}
      </Card>
    </Grid>
  );
}

export default withStyles(styles)(DescribeElementCard);
