import React from 'react';
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
      <Typography variant="h4">{title}</Typography>
      <div className={classes.contentArea}>
        {children}
      </div>
      <Footer/>
    </div>
  );
}

export default withStyles(style)(PageTemplate);
