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

const DescribeElement = ({ classes, title, descriptions, invert, quote }) => (
  <DescribeElementSegment invert={invert}>
    <Typography className={classes.title} type="display1">{title}</Typography>
    <Grid container align="stretch">
      {descriptions.map((description, idx) => (
        <DescribeElementCard key={`card-${idx}`} description={description} invert={invert} quote={quote} />
      ))}
    </Grid>
  </DescribeElementSegment>
);

export default withStyles(styles)(DescribeElement);
