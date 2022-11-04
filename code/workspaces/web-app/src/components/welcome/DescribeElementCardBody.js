import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@mui/styles/withStyles';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import theme from '../../theme';

const cardContent = {
  height: '100%',
};

const bodyText = {
  ...cardContent,
  fontSize: 'larger',
  fontWeight: 'lighter',
  color: theme.typography.color,
};

const quoteStyle = {
  quotes: '"\\2018" "\\2019"', // left and right single quotations
  fontFamily: 'serif',
  fontSize: '4em',
  position: 'relative',
  top: '0.45em',
  lineHeight: 0,
  letterSpacing: '-0.08em',
  color: 'hsl(0, 0%, 70%)',
};

const styles = injectedTheme => ({
  cardContent,
  bodyText,
  quoteBodyText: {
    ...bodyText,
    paddingTop: injectedTheme.spacing(2),
    paddingLeft: '2em',
    paddingRight: '2em',
    '&::before': {
      ...quoteStyle,
      content: 'open-quote open-quote',
      left: '-0.55em',
      display: 'block',
    },
    '&::after': {
      ...quoteStyle,
      content: 'close-quote close-quote',
      left: '0.05em',
    },
  },
  cardImage: {
    height: 90,
    marginBottom: 8,
  },
});

function DescribeElementCardBody({ classes, content, media, quote }) {
  const generateTextBody = textContent => (
    <div className={classes.cardContent}>
      <Typography className={quote ? classes.quoteBodyText : classes.bodyText} variant="body2">
        {textContent}
      </Typography>
    </div>
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
