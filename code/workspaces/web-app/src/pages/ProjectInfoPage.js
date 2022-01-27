import React from 'react';
import makeStyles from '@mui/styles/makeStyles';
import Page from './Page';
import ProjectInfoContainer from '../containers/projectInfo/ProjectInfoContainer';

const useStyles = makeStyles(() => ({
  infoPage: {
    maxWidth: 600,
  },
}));

const ProjectInfoPage = () => {
  const classes = useStyles();

  return (
    <Page className={classes.infoPage} title="Information">
      <ProjectInfoContainer />
    </Page>
  );
};

export default ProjectInfoPage;
