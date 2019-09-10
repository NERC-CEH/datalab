import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import projectActions from '../../actions/projectActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import StackCards from '../../components/stacks/StackCards';

const TYPE_NAME = 'Project';

class ProjectsContainer extends Component {
  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.projects.fetching;
    return !isFetching;
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadProjects()
      .catch((() => {}));
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.projects}>
        <StackCards
          stacks={this.props.projects.value}
          typeName={TYPE_NAME}
          openStack={() => {}}
          deleteStack={() => {}}
          openCreationForm={() => {}}
          userPermissions={this.props.userPermissions}
          createPermission=""
          openPermission=""
          deletePermission=""
          editPermission=""
        />
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

export { ProjectsContainer as PureProjectsContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(ProjectsContainer);
