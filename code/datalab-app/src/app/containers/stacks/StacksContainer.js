import React, { Component } from 'react';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import stackActions from '../../actions/stackActions';
import modalDialogActions from '../../actions/modalDialogActions';
import StackCards from '../../components/stacks/StackCards';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import notify from '../../components/common/notify';

class StacksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openStack = this.openStack.bind(this);
    this.confirmDeleteStack = this.confirmDeleteStack.bind(this);
  }

  openStack(id) {
    return this.props.actions.getUrl(id)
      .then(payload => this.props.actions.openStack(payload.value.redirectUrl))
      .catch(err => notify.error(`Unable to open ${this.props.typeName}`));
  }

  deleteStack = stack =>
    Promise.resolve(this.props.actions.closeModalDialog())
      .then(() => this.props.actions.deleteStack(stack))
      .then(() => notify.success(`${this.props.typeName} deleted`))
      .catch(err => notify.error(`Unable to delete ${this.props.typeName}`))
      .finally(() => this.props.actions.loadStacksByCategory(this.props.containerType));

  confirmDeleteStack(stack) {
    this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
      title: `Delete ${stack.displayName} ${this.props.typeName}`,
      body: `Would you like to delete the ${stack.displayName} ${this.props.typeName}? Any saved work will continue to be 
        stored in the shared drive.`,
      onSubmit: () => this.deleteStack(stack),
      onCancel: this.props.actions.closeModalDialog,
    });
  }

  componentWillMount() {
    this.props.actions.loadStacksByCategory(this.props.containerType);
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.stacks}>
        <StackCards
          stacks={this.props.stacks.value}
          typeName={this.props.typeName}
          containerType={this.props.containerType}
          dialogAction={this.props.dialogAction}
          formStateName={this.props.formStateName}
          openStack={this.openStack}
          deleteStack={this.confirmDeleteStack} />
      </PromisedContentWrapper>
    );
  }
}

StacksContainer.propTypes = {
  stacks: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
  typeName: PropTypes.string.isRequired,
  containerType: PropTypes.string.isRequired,
  dialogAction: PropTypes.string.isRequired,
  formStateName: PropTypes.string.isRequired,
  actions: PropTypes.shape({
    loadStacksByCategory: PropTypes.func.isRequired,
    getUrl: PropTypes.func.isRequired,
    openStack: PropTypes.func.isRequired,
    deleteStack: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
};

function mapStateToProps({ stacks }) {
  return { stacks };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...stackActions,
      ...modalDialogActions,
    }, dispatch),
  };
}

export { StacksContainer as PureStacksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(StacksContainer);
