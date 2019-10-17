import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import useCurrentProject from '../../hooks/useCurrentProject';
import ProjectKey from '../../components/common/typography/ProjectKey';

const useStyles = makeStyles(theme => ({
  projectTitle: {
    marginRight: theme.spacing(2),
  },
  projectTitleWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  projectKey: {
    marginBottom: theme.typography.h5.marginBottom,
  },
  collaborationLink: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    marginTop: theme.spacing(2),
  },
  collaborationLinkHeading: {
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
  },
}));

const ProjectInfoContainer = () => {
  const currentProject = useCurrentProject();
  return <PureProjectInfoContainer currentProject={currentProject} />;
};

export const PureProjectInfoContainer = ({ currentProject }) => {
  const classes = useStyles();
  const { name, key, description, collaborationLink } = currentProject.value;

  return (
    <PromisedContentWrapper promise={currentProject}>
      <div>
        <div className={classes.projectTitleWrapper}>
          <Typography variant="h5" className={classes.projectTitle}>{name}</Typography>
          <ProjectKey className={classes.projectKey}>{key && `(${key})`}</ProjectKey>
        </div>
        <Typography variant="body1">{description}</Typography>
        <CollaborationLink link={collaborationLink}/>
      </div>
    </PromisedContentWrapper>
  );
};

export const CollaborationLink = ({ link }) => {
  const classes = useStyles();

  if (!link) {
    return null;
  }

  return (
    <div className={classes.collaborationLink}>
      <Typography className={classes.collaborationLinkHeading}>Collaboration Link</Typography>
      <Typography variant="body1">
        <a href={link} target="_blank" rel="noopener noreferrer" >{link}</a>
      </Typography>
    </div>
  );
};

export default ProjectInfoContainer;
