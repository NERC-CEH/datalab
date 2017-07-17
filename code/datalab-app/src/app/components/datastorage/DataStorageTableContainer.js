import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dataStorageActions from '../../actions/dataStorageActions';
import DataStorageTable from './DataStorageTable';

class DataStorageTableContainer extends Component {
  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  render() {
    return (
      <DataStorageTable dataStorage={this.props.dataStorage.value} />
    );
  }
}

function mapStateToProps({ dataStorage }) {
  return { dataStorage };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...dataStorageActions,
    }, dispatch),
  };
}

export { DataStorageTableContainer as PureDataStorageTableContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(DataStorageTableContainer);
