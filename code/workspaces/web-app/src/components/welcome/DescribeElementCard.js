import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import DescribeElementCardBanner from './DescribeElementCardBanner';
import DescribeElementCardBody from './DescribeElementCardBody';
import DescribeElementCardLinks from './DescribeElementCardLinks';
import theme from '../../theme';

const cardStyle = {
  minHeight: '100%',
  margin: theme.spacing(2),
  padding: theme.spacing(4),
  width: 350,
  maxWidth: 500,
  flexGrow: 1,
  boxShadow: '0 2px 6px hsla(0, 0%, 0%, 0.22), 0 2px 15px hsla(0, 0%, 0%, 0.1)',
  borderRadius: theme.shape.borderRadius,
};

const cardContentWrapper = {
  display: 'flex',
  flexDirection: 'column',
  // add extra margin to top of all but first direct descendants
  '& > *:not(:first-child)': {
    marginTop: theme.spacing(4),
  },
  height: '100%',
};

const styles = () => ({
  card: cardStyle,
  shadedCard: {
    ...cardStyle,
    backgroundColor: 'hsl(0, 0%, 100%)',
  },
  cardContentWrapper,
  quoteCardContentWrapper: {
    ...cardContentWrapper,
    alignItems: 'space-between',
  },
});

function DescribeElementCard({ classes, icon, title, content, links, invert, quote, media }) {
  const banner = (<DescribeElementCardBanner key="card-banner" icon={icon} title={title} quote={quote} />);
  const body = (<DescribeElementCardBody key="card-body" content={content} media={media} quote={quote} />);
  const actions = links ? (<DescribeElementCardLinks key="card-links" links={links} />) : undefined;

  let cardContent = [banner, body];

  if (quote) {
    cardContent = cardContent.reverse();
  }

  cardContent.push(actions);

  return (
    <div className={invert ? classes.card : classes.shadedCard}>
      <div className={quote ? classes.quoteCardContentWrapper : classes.cardContentWrapper}>
        {cardContent}
      </div>
    </div>
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
};

export default withStyles(styles)(DescribeElementCard);
