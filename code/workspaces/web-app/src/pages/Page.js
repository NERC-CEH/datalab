import React from 'react';
import PropTypes from 'prop-types';
import { Typography, withStyles } from '@material-ui/core';
import Footer from '../components/app/Footer';

const style = theme => ({
  pageTemplate: {
    display: 'flex',
    flexDirection: 'column',
    padding: `0 ${theme.spacing(4)}px`,
    margin: '0 auto',
    width: '100%',
    minWidth: '400px',
    maxWidth: '1000px',
    minHeight: '100%',
  },
  contentArea: {
    flexGrow: 1,
    height: '100%',
  },
});

function Page({ title, children, className, classes }) {
  return (
    <div className={getClassname(classes.pageTemplate, className)}>
      {title ? <Typography variant="h4">{title}</Typography> : null}
      <div className={classes.contentArea}>
        {children}
      </div>
      <Footer/>
    </div>
  );
}

const getClassname = (...classNames) => (classNames.filter(item => item).join(' '));

Page.propTypes = {
  title: PropTypes.string,
  classes: PropTypes.object.isRequired,
};

export default withStyles(style)(Page);
