import React from 'react';
import PropTypes from 'prop-types';
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
  card: cardStyle,
  shadedCard: {
    ...cardStyle,
    backgroundColor: theme.palette.secondary[50],
  },
  cardContent: {
    ...cardStyle,
    display: 'flex',
    flexDirection: 'column',
  },
});

function DescribeElementCard({ classes, icon, title, content, links, invert, quote, media, doubleHeight }) {
  const banner = (<DescribeElementCardBanner key="card-banner" icon={icon} title={title} quote={quote} doubleHeight={doubleHeight} />);
  const body = (<DescribeElementCardBody key="card-body" content={content} media={media} quote={quote} />);
  const actions = links ? (<DescribeElementCardLinks key="card-links" links={links} />) : undefined;

  let cardContent = [banner, body];

  if (quote) {
    cardContent = cardContent.reverse();
  }

  cardContent.push(actions);

  return (
    <Grid item xs={12} sm={6} md={4}>
      <Card className={invert ? classes.card : classes.shadedCard} square>
        <div className={classes.cardContent}>
          {cardContent}
        </div>
      </Card>
    </Grid>
  );
}

DescribeElementCard.propTypes = {
  classes: PropTypes.object.isRequired,
  icon: PropTypes.string,
  title: PropTypes.string.isRequired,
  content: PropTypes.string.isRequired,
  links: PropTypes.arrayOf(PropTypes.object),
  invert: PropTypes.bool,
  quote: PropTypes.bool,
  media: PropTypes.bool,
  doubleHeight: PropTypes.bool,
};

export default withStyles(styles)(DescribeElementCard);
