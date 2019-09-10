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

function Page({ title, children, classes, match }) {
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

Page.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(Page);
