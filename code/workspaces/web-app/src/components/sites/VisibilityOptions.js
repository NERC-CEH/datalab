import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  select: {
    whiteSpace: 'normal',
    maxWidth: 500,
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  title: {
    fontWeight: 500,
  },
  description: {
    color: theme.typography.colorLight,
  },
  warning: {
    marginTop: theme.spacing(0.5),
    color: 'hsl(0, 40%, 40%)',
  },
}));

const Private = () => {
  const classes = useStyles();
  return (
    <div className={classes.select}>
      <Typography variant="body1" className={classes.title}>Private</Typography>
      <Typography variant="body1" className={classes.description}>
        Only you can can view and interact with this site.
      </Typography>
    </div>
  );
};

const Project = () => {
  const classes = useStyles();
  return (
    <div className={classes.select}>
      <Typography variant="body1" className={classes.title}>Project</Typography>
      <Typography variant="body1" className={classes.description}>
        Anyone in this project can view and interact with this site.
      </Typography>
    </div>
  );
};

const Public = () => {
  const classes = useStyles();
  return (
    <div className={classes.select}>
      <Typography variant="body1" className={classes.title}>Public</Typography>
      <Typography variant="body1" className={classes.description}>
        Anyone can view and interact with this site.
      </Typography>
      <Typography variant="body1" className={classes.warning}>
        NOTE: This will make the site available (via URL) to anyone including those external to the DataLabs
        platform. Hence please ensure any security considerations have been implemented before proceeding.
      </Typography>
    </div>
  );
};

const visibilityOptions = [
  {
    text: <Private />,
    value: 'private',
  },
  {
    text: <Project />,
    value: 'project',
  },
  {
    text: <Public />,
    value: 'public',
  },
];

export default visibilityOptions;
