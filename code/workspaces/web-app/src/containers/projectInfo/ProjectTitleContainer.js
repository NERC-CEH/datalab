import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import projectActions from '../../actions/projectActions';
import projectSelectors from '../../selectors/projectsSelectors';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';

class ProjectTitleContainer extends Component {
  render() {
    return (
      <PromisedContentWrapper promise={this.props.currentProject}>
        {this.props.currentProject.value ? (
          <span>{this.props.currentProject.value.name}</span>
        ) : (<div/>)}
      </PromisedContentWrapper>
    );
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.currentProject.fetching;
    return !isFetching || this.props.currentProject.isFetching !== isFetching;
  }

  componentWillMount() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    this.props.actions.setCurrentProject(this.props.projectKey)
      .catch((() => { }));
  }
}

ProjectTitleContainer.propTypes = {
  projectKey: PropTypes.string.isRequired,
};

function mapStateToProps(state) {
  return { currentProject: projectSelectors.currentProject(state) };
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
