import React from 'react';
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
    <Grid container align="stretch">
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

export default withStyles(styles)(DescribeElement);
