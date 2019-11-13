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
    marginTop: theme.spacing(1),
  },
  warning: {
    color: 'hsl(0, 40%, 40%)',
  },
}));

const Personal = () => {
  const classes = useStyles();
  return (
    <div className={classes.select}>
      <Typography variant="body1" className={classes.title}>Personal</Typography>
      <Typography variant="body1" className={classes.description}>
        Only you can can view and interact with this notebook.
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
        NOTE: This option should be used for primarily sharing for view purposes as real-time collaboration
        is not currently fully supported and may result in corruption.
      </Typography>
    </div>
  );
};

const sharingOptions = [
  {
    text: <Personal />,
    value: false,
  },
  {
    text: <Project />,
    value: true,
  },
];

export default sharingOptions;
