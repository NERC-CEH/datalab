import React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core';

/* eslint-disable max-len */
const CONTENT = {
  notebook: {
    projectDescription: 'Anyone in this project can view and interact with this notebook.',
    privateDescription: 'Only you can view and interact with this notebook.',
    projectWarning: 'NOTE: This option will allow multiple users to view and edit notebooks at the same time. As real-time collaboration is not currently supported this may result in corruption, hence this option should be chosen primarily for notebooks that are being viewed/run rather than edited.',
  },
  site: {
    privateDescription: 'Only you can can view and interact with this site.',
    projectDescription: 'Anyone in this project can view and interact with this site.',
    publicDescription: 'Anyone can view and interact with this site.',
    publicWarning: 'NOTE: This will make the site available (via URL) to anyone including those external to the DataLabs platform. Hence please ensure any security considerations have been implemented before proceeding.',
  },
};
/* eslint-disable max-len */

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

const SelectRichComponent = ({ type, title }) => {
  const classes = useStyles();
  const option = title.toLowerCase();

  return (
    <div className={classes.select}>
      <Typography variant="body1" className={classes.title}>{title}</Typography>
      <Typography variant="body1" className={classes.description}>{CONTENT[type][`${option}Description`]}</Typography>
      { (`${option}Warning` in CONTENT[type]) && <Typography variant="body1" className={classes.warning}>{CONTENT[type][`${option}Warning`]}</Typography> }
    </div>
  );
};

const notebookSharingOptions = [
  {
    text: <SelectRichComponent type="notebook" title="Private"/>,
    value: 'private',
  },
  {
    text: <SelectRichComponent type="notebook" title="Project"/>,
    value: 'project',
  },
];

const siteVisibilityOptions = [
  {
    text: <SelectRichComponent type="site" title="Private"/>,
    value: 'private',
  },
  {
    text: <SelectRichComponent type="site" title="Project"/>,
    value: 'project',
  },
  {
    text: <SelectRichComponent type="site" title="Public"/>,
    value: 'public',
  },
];

export { notebookSharingOptions, siteVisibilityOptions };
