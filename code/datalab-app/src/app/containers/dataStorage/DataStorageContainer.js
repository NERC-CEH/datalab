import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import dataStorageActions from '../../actions/dataStorageActions';
import DataStorageTable from './DataStorageTable';
import PromisedContentWrapper from '../common/PromisedContentWrapper';

class DataStorageContainer extends Component {
  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.dataStorage}>
        <DataStorageTable
          dataStorage={this.props.dataStorage.value}
          openStorageAction={this.props.actions.openMinioDataStore} />
      </PromisedContentWrapper>
    );
  }
}

DataStorageContainer.propTypes = {
  dataStorage: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  actions: PropTypes.shape({
    loadDataStorage: PropTypes.func.isRequired,
    loadDataStore: PropTypes.func.isRequired,
    openMinioDataStore: PropTypes.func.isRequired,
  }).isRequired,
};

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

export { DataStorageContainer as PureDataStorageContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(DataStorageContainer);
