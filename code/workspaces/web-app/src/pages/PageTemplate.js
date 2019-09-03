import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import Footer from '../components/app/Footer';

const style = theme => ({
  pageTemplate: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100%',
  },
  contentArea: {
    flexGrow: 1,
  },
});

function PageTemplate({ title, children, classes }) {
  return (
    <div className={classes.pageTemplate}>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      <div className={classes.contentArea}>
        {children}
      </div>
      <Footer/>
    </div>
  );
}

PageTemplate.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(PageTemplate);
