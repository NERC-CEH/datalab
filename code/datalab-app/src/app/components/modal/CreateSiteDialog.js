import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dialog, { DialogTitle, DialogContent } from 'material-ui/Dialog';
import dataStorageActions from '../../actions/dataStorageActions';
import CreateSiteForm from '../sites/CreateSiteForm';
import PreviewSiteCard from '../sites/PreviewSiteCard';

class CreateSiteDialog extends Component {
  constructor(props, context) {
    super(props, context);
    this.getDataStorage = this.getDataStorage.bind(this);
  }

  componentWillMount() {
    this.props.actions.loadDataStorage();
  }

  getDataStorage() {
    const dataStorage = this.props.dataStorage.value || [];
    return dataStorage.map(store => ({ text: store.displayName, value: store.name }));
  }

  render() {
    return (
      <Dialog open={true} maxWidth="md">
        <div style={{ margin: 10, display: 'flex', flexDirection: 'row' }}>
          <div>
            <DialogTitle>{this.props.title}</DialogTitle>
            <DialogContent>
              <CreateSiteForm
                onSubmit={this.props.onSubmit}
                cancel={this.props.onCancel}
                dataStorageOptions={this.getDataStorage()} />
            </DialogContent>
          </div>
          <div style={{ width: 320 }}>
            <DialogTitle>Site Preview</DialogTitle>
            <div style={{ width: '90%', margin: '0 auto' }}>
              <PreviewSiteCard />
            </div>
          </div>
        </div>
      </Dialog>
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

CreateSiteDialog.propTypes = {
  title: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export { CreateSiteDialog as PureCreateSiteDialog }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(CreateSiteDialog);
