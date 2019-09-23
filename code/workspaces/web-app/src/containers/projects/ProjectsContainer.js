import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import theme from '../../theme';
import projectActions from '../../actions/projectActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import StackCards from '../../components/stacks/StackCards';

const TYPE_NAME = 'Project';
const PROJECT_OPEN_PERMISSION = 'project.open';

const styles = () => ({
  controlContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  searchTextField: {
    flexBasis: '40%',
  },
});

const searchInputProps = {
  inputProps: {
    style: {
      backgroundColor: `${theme.palette.backgroundDarkHighTransparent}`,
      color: `${theme.palette.backgroundDark}`,
      paddingLeft: `${theme.spacing * 2}px`,
      paddingTop: `${theme.spacing * 1.6}px`,
      paddingBottom: `${theme.spacing * 1.6}px`,
      paddingRight: `${theme.spacing * 2}px`,
    },
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
    return this.props.projects.value.projectArray.map(projectToStack);
  }

  projectUserPermissions(project) {
    return project && project.accessible ? [PROJECT_OPEN_PERMISSION] : [];
  }

  renderControls() {
    const { classes } = this.props;
    return (
      <div className={classes.controlContainer}>
        <TextField
          className={classes.searchTextField}
          autoFocus={true}
          id="search"
          margin="dense"
          onChange={this.handleSearchTextChange}
          type="search"
          placeholder="Filter projects..."
          variant="outlined"
          value={this.state.searchText}
          InputProps={searchInputProps}
        />
      </div>
    );
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.projects}>
        {this.props.projects.value.projectArray ? (
          <div>
            {this.renderControls()}
            <StackCards
              stacks={this.adaptProjectsToStacks().filter(stack => stackMatchesFilter(stack, this.state.searchText))}
              typeName={TYPE_NAME}
              openStack={project => this.props.history.push(`/projects/${project.key}/info`)}
              deleteStack={() => { }}
              openCreationForm={() => { }}
              userPermissions={project => this.projectUserPermissions(project)}
              createPermission=""
              openPermission={PROJECT_OPEN_PERMISSION}
              deletePermission=""
              editPermission=""
            />
          </div>
        ) : (<div />)}
      </PromisedContentWrapper>
    );
  }
}

ProjectsContainer.propTypes = {
  projects: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.object.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    loadProjects: PropTypes.func.isRequired,
  }).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps({ projects }) {
  return { projects };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...projectActions,
    }, dispatch),
  };
}

const ConnectedProjectsContainer = connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);
export { ProjectsContainer as PureProjectsContainer, ConnectedProjectsContainer, projectToStack, stackMatchesFilter }; // export for testing
export default withStyles(styles)(withRouter(ConnectedProjectsContainer));
