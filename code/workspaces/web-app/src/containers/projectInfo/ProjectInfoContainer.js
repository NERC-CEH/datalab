import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import projectActions from '../../actions/projectActions';
import projectSelectors from '../../selectors/projectsSelectors';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import ProjectInfoContent from '../../components/projectInfo/ProjectInfoContent';

class ProjectInfoContainer extends Component {
  render() {
    return (
      <PromisedContentWrapper promise={this.props.currentProject} fullWidth fullHeight>
        {this.props.currentProject.value ? (
          <ProjectInfoContent projectInfo={this.props.currentProject.value} />
        ) : (<div/>)}
      </PromisedContentWrapper>
    );
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.currentProject.fetching;
    return !isFetching || this.props.currentProject.isFetching !== isFetching;
  }
}

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

export { ProjectInfoContainer as PureProjectInfoContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfoContainer);
