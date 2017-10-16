import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import { CardContent, CardMedia } from 'material-ui/Card';
import Typography from 'material-ui/Typography';

const bodyText = {
  fontSize: 'larger',
  fontWeight: 'lighter',
};

const styles = theme => ({
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
    <CardContent>
      <Typography className={quote ? classes.quoteBodyText : classes.bodyText} type="body1">
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
