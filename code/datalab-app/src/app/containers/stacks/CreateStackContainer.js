import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Promise from 'bluebird';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { reset } from 'redux-form';
import NewStackButton from '../../components/stacks/NewStackButton';
import stackActions from '../../actions/stackActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../../components/common/notify';

class CreateStackContainer extends Component {
  createStack = stack =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.createStack(stack))
      .then(this.props.actions.resetForm(this.props.formStateName))
      .then(() => notify.success(`${this.props.typeName} created`))
      .catch(err => notify.error(`Unable to create ${this.props.typeName}`))
      .finally(this.props.actions.loadStacksByCategory(this.props.containerType));

  openCreationForm = () => this.props.actions.openModalDialog(this.props.dialogAction, {
    title: `Create a ${this.props.typeName}`,
    onSubmit: this.createStack,
    onCancel: this.props.actions.closeModalDialog,
  });

  render() {
    return (
      <NewStackButton onClick={this.openCreationForm} typeName={this.props.typeName}/>
    );
  }
}

CreateStackContainer.propTypes = {
  typeName: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
  dialogAction: PropTypes.string.isRequired,
  formStateName: PropTypes.string.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...stackActions,
      ...modalDialogActions,
      resetForm: formStateName => reset(formStateName),
    }, dispatch),
  };
}

export { CreateStackContainer as PureCreateStackContainer }; // export for testing
export default connect(undefined, mapDispatchToProps)(CreateStackContainer);
