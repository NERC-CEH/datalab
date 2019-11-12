import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(() => ({
  select: {
    whiteSpace: 'normal',
    maxWidth: 500,
  },
  warning: {
    color: 'hsl(0, 40%, 40%)',
  },
}));

const Personal = () => {
  const classes = useStyles();
  return (
        <div className={classes.select}>
            <Typography variant="body1">Personal</Typography>
            <Typography variant="body2">
                Only you can can view and interact with this notebook.
            </Typography>
        </div>
  );
};

const Project = () => {
  const classes = useStyles();
  return (<div className={classes.select}>
        <Typography variant="body1">Project</Typography>
        <Typography variant="body2">Anyone in this project can view and interact with this notebook.</Typography>
        <Typography variant="body2" className={classes.warning}>
            NOTE: This option should be used for primarily sharing for view purposes as real-time collaboration
            is not currently fully supported and may result in corruption.
        </Typography>
    </div>);
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
