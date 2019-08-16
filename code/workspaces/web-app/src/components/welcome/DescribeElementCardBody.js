import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';

const cardContent = {
  height: '100%',
};

const bodyText = {
  ...cardContent,
  fontSize: 'larger',
  fontWeight: 'lighter',
};

const styles = theme => ({
  cardContent,
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

function DescribeElementCardBody({ classes, content, media, quote }) {
  const generateTextBody = textContent => (
    <CardContent className={classes.cardContent}>
      <Typography className={quote ? classes.quoteBodyText : classes.bodyText} variant="body2">
        {textContent}
      </Typography>
    </CardContent>
  );

  const generateMediaBody = mediaContent => (
    <CardMedia key="card-body" className={classes.cardImage} image={mediaContent} />
  );

  return media ? generateMediaBody(content) : generateTextBody(content);
}

DescribeElementCardBody.propTypes = {
  classes: PropTypes.object.isRequired,
  content: PropTypes.string.isRequired,
  media: PropTypes.bool,
  quote: PropTypes.bool,
};

export default withStyles(styles)(DescribeElementCardBody);