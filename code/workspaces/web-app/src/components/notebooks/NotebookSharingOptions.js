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
        Only you can view and interact with this notebook.
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
        Anyone in this project can view and interact with this notebook.
      </Typography>
      <Typography variant="body1" className={classes.warning}>
        NOTE: This option will allow multiple users to view and edit notebooks at
        the same time. As real-time collaboration is not currently supported this
        may result in corruption, hence this option should be chosen primarily for
        notebooks that are being viewed/run rather than edited.
      </Typography>
    </div>
  );
};

const sharingOptions = [
  {
    text: <Private />,
    value: 'private',
  },
  {
    text: <Project />,
    value: 'project',
  },
];

export default sharingOptions;
