import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import projectActions from '../../actions/projectActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';

class ProjectTitleContainer extends Component {
  render() {
    return (
      <PromisedContentWrapper promise={this.props.projects}>
        {this.props.projects.value.currentProject ? (
          <span>{this.props.projects.value.currentProject.name}</span>
        ) : (<div/>)}
      </PromisedContentWrapper>
    );
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.projects.fetching;
    return !isFetching || this.props.projects.isFetching !== isFetching;
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.loadProjectInfo(this.props.projectKey)
      .catch((() => { }));
  }
}

ProjectTitleContainer.propTypes = {
  projectKey: PropTypes.string.isRequired,
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

export { ProjectTitleContainer as PureProjectTitleContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(ProjectTitleContainer);
