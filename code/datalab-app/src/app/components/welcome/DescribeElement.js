import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import DescribeElementSegment from './DescribeElementSegment';
import DescribeElementCard from './DescribeElementCard';

const styles = theme => ({
  title: {
    paddingTop: 28,
    paddingBottom: 28,
  },
});

const DescribeElement = ({ classes, title, descriptions, invert, quote, media }) => (
  <DescribeElementSegment invert={invert}>
    <Typography className={classes.title} type="display1">{title}</Typography>
    <Grid container>
      {descriptions.map(({ icon, title: cardTitle, content: cardContent, links }, idx) => (
        <DescribeElementCard
          key={`card-${idx}`}
          icon={icon}
          title={cardTitle}
          content={cardContent}
          links={links}
          invert={invert}
          quote={quote}
          media={media}
        />
      ))}
    </Grid>
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
};

export default withStyles(styles)(DescribeElement);
