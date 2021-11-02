import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { reset } from 'redux-form';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ListItem from '@material-ui/core/ListItem';
import { permissionTypes, stackTypes } from 'common';
import theme from '../../theme';
import projectActions from '../../actions/projectActions';
import modalDialogActions from '../../actions/modalDialogActions';
import StackCards from '../../components/stacks/StackCards';
import { MODAL_TYPE_CREATE_PROJECT, MODAL_TYPE_ROBUST_CONFIRMATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';
import { useProjectsArray } from '../../hooks/projectsHooks';
import { useCurrentUserPermissions } from '../../hooks/authHooks';
import { PROJECT_TYPE_NAME, PROJECT_TYPE_NAME_PLURAL } from './projectTypeName';

export const PROJECT_OPEN_PERMISSION = 'project.open';
const FORM_NAME = 'createProject';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const useStyles = makeStyles(styleTheme => ({
  controlContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: styleTheme.spacing(2),
  },
  searchTextField: {
    width: '100%',
    margin: 0,
  },
  active: {
    borderRadius: styleTheme.shape.borderRadius,
    color: styleTheme.palette.highlightMono,
    background: styleTheme.palette.backgroundDark,
    '&:hover': {
      background: styleTheme.palette.backgroundDarkTransparent,
    },
  },
  inactive: {
    borderRadius: styleTheme.shape.borderRadius,
    color: styleTheme.typography.color,
    background: styleTheme.palette.highlightMono,
    '&:hover': {
      background: styleTheme.palette.highlightMonoTransparent,
    },
  },
  filters: {
    display: 'flex',
    whiteSpace: 'nowrap',
    paddingRight: styleTheme.spacing(2),
  },
}));

const searchInputProps = {
  disableUnderline: true,
  style: {
    backgroundColor: theme.palette.backgroundDarkHighTransparent,
    borderRadius: theme.shape.borderRadius,
  },
};

export const projectToStack = project => ({
  id: project.id,
  key: project.key,
  displayName: project.name,
  description: project.description,
  accessible: project.accessible,
  type: stackTypes.PROJECT,
  status: 'ready',
});

export const stackMatchesFilter = ({ displayName, description, key }, searchText) => {
  const filter = searchText.toLowerCase();
  return displayName.toLowerCase().includes(filter)
    || description.toLowerCase().includes(filter)
    || key.includes(filter);
};

const adaptProjectsToStacks = projects => ({
  ...projects,
  value: projects.value ? projects.value.map(projectToStack) : [],
});

const filterProjectStacks = (projectStacks, searchText) => ({
  ...projectStacks,
  value: projectStacks.value.filter(stack => stackMatchesFilter(stack, searchText)),
});

const filterProjectsByUser = (projectStacks, myProjectFilter) => ({
  ...projectStacks,
  value: myProjectFilter ? projectStacks.value.filter(stack => stack.accessible) : projectStacks.value,
});

const projectUserPermissions = (project, userPermissions) => (
  (project && project.accessible) || userPermissions.includes(SYSTEM_INSTANCE_ADMIN)
    ? [PROJECT_OPEN_PERMISSION]
    : []
);

export const openCreationForm = (dispatch, requestOnly) => () => dispatch(
  modalDialogActions.openModalDialog(
    MODAL_TYPE_CREATE_PROJECT,
    {
      requestOnly,
      onSubmit: onCreateProjectSubmit(dispatch, requestOnly),
      onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
    },
  ),
);

export const onCreateProjectSubmit = (dispatch, requestOnly) => async (project) => {
  dispatch(modalDialogActions.closeModalDialog());
  try {
    if (requestOnly) {
      await dispatch(projectActions.requestProject(project));
    } else {
      await dispatch(projectActions.createProject(project));
    }
    await reset(FORM_NAME);
    notify.success(`${PROJECT_TYPE_NAME} ${requestOnly ? 'requested: a notification has been sent to the instance admins.' : 'created'}`);
  } catch (error) {
    notify.error(`Unable to ${requestOnly ? 'request' : 'create'} ${PROJECT_TYPE_NAME}`);
  } finally {
    await dispatch(projectActions.loadProjects());
  }
};

export const confirmDeleteProject = dispatch => projectStack => dispatch(
  modalDialogActions.openModalDialog(
    MODAL_TYPE_ROBUST_CONFIRMATION,
    {
      title: `Delete ${PROJECT_TYPE_NAME} "${projectStack.displayName} (${projectStack.key})"`,
      body: `Are you sure you want to delete the ${PROJECT_TYPE_NAME} "${projectStack.displayName} (${projectStack.key})"?
        This action will destroy all data related to the ${PROJECT_TYPE_NAME} and can not be undone.`,
      confirmField: {
        label: `Please type "${projectStack.key}" to confirm`,
        expectedValue: projectStack.key,
      },
      onSubmit: () => deleteProject(dispatch, projectStack),
      onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
    },
  ),
);

export const deleteProject = async (dispatch, projectStack) => {
  try {
    await dispatch(projectActions.deleteProject(projectStack.key));
    dispatch(modalDialogActions.closeModalDialog());
    notify.success(`${PROJECT_TYPE_NAME} deleted.`);
  } catch (error) {
    notify.error(`Unable to delete ${PROJECT_TYPE_NAME}.`);
  } finally {
    dispatch(projectActions.loadProjects());
  }
};

const Controls = ({ myProjectsFilter, toggleMyProjectsFilter, searchText, onSearchTextChange }) => {
  const classes = useStyles();
  return (
    <div className={classes.controlContainer}>
      <div className={classes.filters}>
        <ListItem
          button={true}
          onClick={toggleMyProjectsFilter}
          className={myProjectsFilter ? classes.active : classes.inactive}
        >
          My Projects
        </ListItem>
      </div>
      <TextField
        id="search"
        className={classes.searchTextField}
        autoFocus
        hiddenLabel
        margin="dense"
        onChange={onSearchTextChange}
        type="search"
        placeholder="Filter projects..."
        variant="filled"
        value={searchText}
        InputProps={searchInputProps}
      />
    </div>
  );
};

const ProjectsContainer = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const projects = useProjectsArray();
  const userPermissions = useCurrentUserPermissions().value;
  const [searchText, setSearchText] = useState('');
  const [myProjectFilter, setMyProjectFilter] = useState(true);

  useEffect(() => {
    dispatch(projectActions.loadProjects());
  }, [dispatch, projects.isFetching]);

  const handleSearchTextChange = event => setSearchText(event.target.value);
  const handleMyProjectsFilterChange = () => setMyProjectFilter(!myProjectFilter);

  const filteredStacks = filterProjectStacks(
    adaptProjectsToStacks(projects),
    searchText,
  );
  const userAccessibleStacks = filterProjectsByUser(filteredStacks, myProjectFilter);

  const isAdmin = userPermissions.includes(SYSTEM_INSTANCE_ADMIN);

  return (
    <>
      <Controls
        myProjectsFilter={myProjectFilter}
        toggleMyProjectsFilter={handleMyProjectsFilterChange}
        searchText={searchText}
        onSearchTextChange={handleSearchTextChange}
      />
      <StackCards
        stacks={userAccessibleStacks}
        typeName={PROJECT_TYPE_NAME}
        typeNamePlural={PROJECT_TYPE_NAME_PLURAL}
        openStack={project => history.push(`/projects/${project.key}/info`)}
        deleteStack={confirmDeleteProject(dispatch)}
        openCreationForm={openCreationForm(dispatch, !isAdmin)}
        showCreateButton={true}
        userPermissions={project => [...projectUserPermissions(project, userPermissions), ...userPermissions]}
        createPermission={userPermissions[0]}
        openPermission={PROJECT_OPEN_PERMISSION}
        deletePermission=""
        editPermission=""
        actionButtonLabelPrefix={isAdmin ? null : 'Request'}
      />
    </>
  );
};

export default ProjectsContainer;
