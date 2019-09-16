import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import projectActions from '../../actions/projectActions';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import ProjectInfoContent from '../../components/projectInfo/ProjectInfoContent';

class ProjectInfoContainer extends Component {
  render() {
    return (
      <PromisedContentWrapper promise={this.props.projects}>
        {this.props.projects.value.currentProject ? (
          <ProjectInfoContent projectInfo={this.props.projects.value.currentProject} />
        ) : (<div/>)}
      </PromisedContentWrapper>
    );
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.projects.fetching;
    return !isFetching || this.props.projects.isFetching !== isFetching;
  }
}

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

export { ProjectInfoContainer as PureProjectInfoContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(ProjectInfoContainer);
