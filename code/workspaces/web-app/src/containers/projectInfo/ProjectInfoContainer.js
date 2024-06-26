import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import makeStyles from '@mui/styles/makeStyles';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AccordionDetails from '@mui/material/AccordionDetails';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import { useCurrentProject } from '../../hooks/currentProjectHooks';
import { useProjectUsers } from '../../hooks/projectUsersHooks';
import projectSettingsActions from '../../actions/projectSettingsActions';
import ResourceInfoSpan from '../../components/common/typography/ResourceInfoSpan';
import { ResourceAccordion, ResourceAccordionSummary } from '../../components/common/ResourceAccordion';

const useStyles = makeStyles(theme => ({
  projectTitle: {
    marginRight: theme.spacing(2),
  },
  description: {
    marginBottom: theme.spacing(2),
  },
  projectTitleWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
  },
  ResourceInfoSpan: {
    marginBottom: theme.typography.h5.marginBottom,
  },
  collaborationLink: {
    display: 'flex',
    flexWrap: 'wrap',
    alignItems: 'baseline',
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  collaborationLinkHeading: {
    marginRight: theme.spacing(2),
    fontWeight: 'bold',
  },
  userBlock: {
    paddingTop: theme.spacing(2),
  },
  chipTitle: {
    textTransform: 'capitalize',
  },
}));

const ProjectInfoContainer = () => {
  const currentProject = useCurrentProject();
  return <PureProjectInfoContainer currentProject={currentProject} />;
};

export const PureProjectInfoContainer = ({ currentProject }) => {
  const { name, key, description, collaborationLink } = currentProject.value;
  const classes = useStyles();
  const users = useProjectUsers();
  const dispatch = useDispatch();

  useEffect(
    () => {
      if (key) {
        dispatch(projectSettingsActions.getProjectUserPermissions(key));
      }
    },
    [dispatch, key],
  );

  return (
    <PromisedContentWrapper promise={currentProject}>
      <div>
        <div className={classes.projectTitleWrapper}>
          <Typography variant="h5" className={classes.projectTitle}>{name}</Typography>
          <ResourceInfoSpan className={classes.ResourceInfoSpan}>{key && `(${key})`}</ResourceInfoSpan>
        </div>
        <Typography className={classes.description} variant="body1">{description}</Typography>
        <CollaborationLink link={collaborationLink} />
        <div className={classes.userBlock}>
          { users && users.value
            && <div>
              <UserBlock name='admin' users={users.value.filter(user => user.role === 'admin')} classes={classes} />
              <UserBlock name='user' users={users.value.filter(user => user.role === 'user')} classes={classes} />
              <UserBlock name='viewer' users={users.value.filter(user => user.role === 'viewer')} classes={classes} />
            </div>
          }
        </div>
      </div>
    </PromisedContentWrapper>
  );
};

export const UserBlock = ({ name, users, classes }) => (users.length === 0 ? null
  : <ResourceAccordion>
      <ResourceAccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography className={classes.chipTitle} variant="h6">{name}s</Typography>
      </ResourceAccordionSummary>
      {/* ResourceAccordionDetails sets display: flex making the user
          chips format weirdly, so we use a regular mui AccordionDetails */}
      <AccordionDetails>
        {users.map(user => <Chip key={user.userId} tabIndex={-1} label={user.name} />)}
      </AccordionDetails>
    </ResourceAccordion>
);

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
