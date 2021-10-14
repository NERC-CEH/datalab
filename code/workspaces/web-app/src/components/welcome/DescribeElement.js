import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import DescribeElementSegment from './DescribeElementSegment';
import DescribeElementCard from './DescribeElementCard';

const styles = theme => ({
  title: {
    paddingTop: theme.spacing(6),
    paddingBottom: theme.spacing(2),
    marginTop: theme.spacing(5),
    marginBottom: theme.spacing(5),
  },
  contentContainer: {
    margin: 'auto',
    padding: theme.spacing(4),
    maxWidth: 1000,
  },
  cardContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
  },
});

const DescribeElement = ({ classes, title, descriptions, invert, quote, media }) => (
  <DescribeElementSegment invert={invert}>
    <div className={classes.contentContainer}>
      <Typography className={classes.title} variant="h4">{title}</Typography>
      <div className={classes.cardContainer}>
        {descriptions.map(({ icon, title: cardTitle, content: cardContent, links }, idx) => (
          <DescribeElementCard
            key={`card-${idx}`}
            icon={icon}
            title={cardTitle}
            content={cardContent}
            links={links}
            quote={quote}
            media={media}
          />
        ))}
      </div>
    </div>
  </DescribeElementSegment>
);

DescribeElement.propTypes = {
  classes: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.shape({
    icon: PropTypes.string,
    title: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
    links: PropTypes.arrayOf(PropTypes.object),
  }),
  invert: PropTypes.bool,
  quote: PropTypes.bool,
  media: PropTypes.bool,
  doubleHeight: PropTypes.bool,
};

export default withStyles(styles)(DescribeElement);
