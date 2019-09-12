import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { permissionTypes } from 'common';
import projectActions from '../../actions/projectActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import StackCards from '../../components/stacks/StackCards';

const { projectPermissions: { PROJECT_STORAGE_OPEN } } = permissionTypes;

const TYPE_NAME = 'Project';

class ProjectsContainer extends Component {
  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.projects.fetching;
    return !isFetching || this.props.projects.isFetching !== isFetching;
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadProjects()
      .catch((() => { }));
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.projects}>
        {this.props.projects.value.projectArray ? (
          <StackCards
            stacks={this.props.projects.value.projectArray}
            typeName={TYPE_NAME}
            openStack={id => this.props.history.push(`/projects/${id}/info`)}
            deleteStack={() => { }}
            openCreationForm={() => { }}
            userPermissions={this.props.userPermissions}
            createPermission=""
            openPermission={PROJECT_STORAGE_OPEN}
            deletePermission=""
            editPermission=""
          />
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
export { ProjectsContainer as PureProjectsContainer, ConnectedProjectsContainer }; // export for testing
export default withRouter(ConnectedProjectsContainer);
