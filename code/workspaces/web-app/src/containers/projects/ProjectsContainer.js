import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import { permissionTypes } from 'common';
import theme from '../../theme';
import projectActions from '../../actions/projectActions';
import projectSelectors from '../../selectors/projectsSelectors';
import modalDialogActions from '../../actions/modalDialogActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import StackCards from '../../components/stacks/StackCards';
import { MODAL_TYPE_CREATE_PROJECT, MODAL_TYPE_ROBUST_CONFIRMATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';

const TYPE_NAME = 'Project';
const TYPE_NAME_PLURAL = 'Projects';
const PROJECT_OPEN_PERMISSION = 'project.open';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const styles = styleTheme => ({
  controlContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: styleTheme.spacing(2),
  },
  searchTextField: {
    width: '100%',
    margin: 0,
  },
});

const searchInputProps = {
  disableUnderline: true,
  style: {
    backgroundColor: theme.palette.backgroundDarkHighTransparent,
    borderRadius: theme.shape.borderRadius,
  },
};

const projectToStack = project => ({
  id: project.id,
  key: project.key,
  displayName: project.name,
  description: project.description,
  accessible: project.accessible,
  type: 'project',
  status: 'ready',
});

const stackMatchesFilter = ({ displayName, description }, searchText) => {
  const filter = searchText.toLowerCase();
  return displayName.toLowerCase().includes(filter)
    || description.toLowerCase().includes(filter);
};

class ProjectsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchText: '',
    };
    this.handleSearchTextChange = this.handleSearchTextChange.bind(this);
    this.onCreateProjectSubmit = this.onCreateProjectSubmit.bind(this);
    this.openCreationForm = this.openCreationForm.bind(this);
    this.projectUserPermissions = this.projectUserPermissions.bind(this);
    this.confirmDeleteProject = this.confirmDeleteProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
  }

  handleSearchTextChange(event) {
    this.setState({ searchText: event.target.value });
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.projects.fetching;
    return !isFetching || this.props.projects.isFetching !== isFetching;
  }

  componentWillMount() {
    this.props.actions.loadProjects();
  }

  adaptProjectsToStacks() {
    return this.props.projects.value
      ? this.props.projects.value.map(projectToStack)
      : [];
  }

  projectUserPermissions(project) {
    return (project && project.accessible) || this.props.userPermissions.includes(SYSTEM_INSTANCE_ADMIN)
      ? [PROJECT_OPEN_PERMISSION]
      : [];
  }

  async onCreateProjectSubmit(project) {
    this.props.actions.closeModalDialog();
    try {
      await this.props.actions.createProject(project);
      notify.success(`${TYPE_NAME} created`);
    } catch (error) {
      notify.error(`Unable to create ${TYPE_NAME}`);
    } finally {
      await this.props.actions.loadProjects();
    }
  }

  openCreationForm() {
    this.props.actions.openModalDialog(
      MODAL_TYPE_CREATE_PROJECT,
      {
        onSubmit: this.onCreateProjectSubmit,
        onCancel: this.props.actions.closeModalDialog,
      },
    );
  }

  confirmDeleteProject = projectStack => this.props.actions.openModalDialog(MODAL_TYPE_ROBUST_CONFIRMATION, {
    title: `Delete ${TYPE_NAME} "${projectStack.displayName} (${projectStack.key})"`,
    body: `Are you sure you want to delete the ${TYPE_NAME} "${projectStack.displayName} (${projectStack.key})"?
      This action will destroy all data related to the ${TYPE_NAME} and can not be undone.`,
    confirmField: {
      label: `Please type "${projectStack.key}" to confirm`,
      expectedValue: projectStack.key,
    },
    onSubmit: () => this.deleteProject(projectStack),
    onCancel: this.props.actions.closeModalDialog,
  });

  deleteProject = async (projectStack) => {
    try {
      await this.props.actions.deleteProject(projectStack.key);
      this.props.actions.closeModalDialog();
      notify.success(`${TYPE_NAME} deleted.`);
    } catch (error) {
      notify.error(`Unable to delete ${TYPE_NAME}.`);
    } finally {
      this.props.actions.loadProjects();
    }
  };

  renderControls() {
    const { classes } = this.props;
    return (
      <div className={classes.controlContainer}>
        <TextField
          id="search"
          className={classes.searchTextField}
          autoFocus={true}
          hiddenLabel
          margin="dense"
          onChange={this.handleSearchTextChange}
          type="search"
          placeholder="Filter projects..."
          variant="filled"
          value={this.state.searchText}
          InputProps={searchInputProps}
        />
      </div>
    );
  }

  render() {
    const { projects, history } = this.props;
    return (
      <PromisedContentWrapper promise={projects}>
        <div>
          {this.renderControls()}
          <StackCards
            stacks={this.adaptProjectsToStacks().filter(stack => stackMatchesFilter(stack, this.state.searchText))}
            typeName={TYPE_NAME}
            typeNamePlural={TYPE_NAME_PLURAL}
            openStack={project => history.push(`/projects/${project.key}/info`)}
            deleteStack={this.confirmDeleteProject}
            openCreationForm={this.openCreationForm}
            userPermissions={project => [...this.projectUserPermissions(project), ...this.props.userPermissions]}
            createPermission={SYSTEM_INSTANCE_ADMIN}
            openPermission={PROJECT_OPEN_PERMISSION}
            deletePermission=""
            editPermission=""
          />
        </div>
      </PromisedContentWrapper>
    );
  }
}

ProjectsContainer.propTypes = {
  projects: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    loadProjects: PropTypes.func.isRequired,
  }).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps(state) {
  return { projects: projectSelectors.projectArray(state) };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...projectActions,
      ...modalDialogActions,
    }, dispatch),
  };
}

const ConnectedProjectsContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);
export { ProjectsContainer as PureProjectsContainer, ConnectedProjectsContainer, projectToStack, stackMatchesFilter }; // export for testing
export default withStyles(styles)(withRouter(ConnectedProjectsContainer));
