import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reset } from 'redux-form';
import Promise from 'bluebird';
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { permissionTypes } from 'common';
import { MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../../components/common/notify';
import PromisedContentWrapper from '../../components/common/PromisedContentWrapper';
import stackActions from '../../actions/stackActions';
import StackCards from '../../components/stacks/StackCards';

const refreshTimeout = 15000;

const { projectPermissions: { PROJECT_STACKS_CREATE, PROJECT_STACKS_DELETE, PROJECT_STACKS_OPEN, PROJECT_STACKS_EDIT } } = permissionTypes;

class StacksContainer extends Component {
  constructor(props, context) {
    super(props, context);
    this.openStack = this.openStack.bind(this);
    this.createStack = this.createStack.bind(this);
    this.openCreationForm = this.openCreationForm.bind(this);
    this.deleteStack = this.deleteStack.bind(this);
    this.confirmDeleteStack = this.confirmDeleteStack.bind(this);
    this.loadStack = this.loadStack.bind(this);
  }

  openStack(stack) {
    return this.props.actions.getUrl(stack.id)
      .then(payload => this.props.actions.openStack(payload.value.redirectUrl))
      .catch(err => notify.error(`Unable to open ${this.props.typeName}`));
  }

  createStack = stack => Promise.resolve(this.props.actions.closeModalDialog())
    .then(() => this.props.actions.createStack(stack))
    .then(() => this.props.actions.resetForm(this.props.formStateName))
    .then(() => notify.success(`${this.props.typeName} created`))
    .catch(err => notify.error(`Unable to create ${this.props.typeName}`))
    .finally(() => this.props.actions.loadStacksByCategory(this.props.containerType));

  openCreationForm = () => this.props.actions.openModalDialog(this.props.dialogAction, {
    title: `Create a ${this.props.typeName}`,
    onSubmit: this.createStack,
    onCancel: this.props.actions.closeModalDialog,
  });

  deleteStack = stack => Promise.resolve(this.props.actions.closeModalDialog())
    .then(() => this.props.actions.deleteStack(stack))
    .then(() => notify.success(`${this.props.typeName} deleted`))
    .catch(err => notify.error(`Unable to delete ${this.props.typeName}`))
    .finally(() => this.props.actions.loadStacksByCategory(this.props.containerType));

  confirmDeleteStack = stack => this.props.actions.openModalDialog(MODAL_TYPE_CONFIRMATION, {
    title: `Delete ${stack.displayName} ${this.props.typeName}`,
    body: `Would you like to delete the ${stack.displayName} ${this.props.typeName}? Any saved work will continue to be
        stored in the shared drive.`,
    onSubmit: () => this.deleteStack(stack),
    onCancel: this.props.actions.closeModalDialog,
  });

  loadStack() {
    // Added .catch to prevent unhandled promise error, when lacking permission to view content
    return this.props.actions.loadStacksByCategory(this.props.containerType)
      .then(() => {
        this.timeout = setTimeout(this.loadStack, refreshTimeout);
      })
      .catch((() => {}));
  }

  componentWillMount() {
    this.loadStack();
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
  }

  shouldComponentUpdate(nextProps) {
    const isFetching = nextProps.stacks.fetching;
    return !isFetching;
  }

  render() {
    return (
      <PromisedContentWrapper promise={this.props.stacks}>
        <StackCards
          stacks={this.props.stacks.value}
          typeName={this.props.typeName}
          openStack={this.openStack}
          deleteStack={this.confirmDeleteStack}
          openCreationForm={this.openCreationForm}
          userPermissions={() => this.props.userPermissions}
          createPermission={PROJECT_STACKS_CREATE}
          openPermission={PROJECT_STACKS_OPEN}
          deletePermission={PROJECT_STACKS_DELETE}
          editPermission={PROJECT_STACKS_EDIT} />
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
    createStack: PropTypes.func.isRequired,
    deleteStack: PropTypes.func.isRequired,
    openModalDialog: PropTypes.func.isRequired,
    closeModalDialog: PropTypes.func.isRequired,
  }).isRequired,
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

function mapStateToProps({ stacks }) {
  return { stacks };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators({
      ...stackActions,
      ...modalDialogActions,
      resetForm: formStateName => reset(formStateName),
    }, dispatch),
  };
}

export { StacksContainer as PureStacksContainer }; // export for testing
export default connect(mapStateToProps, mapDispatchToProps)(StacksContainer);
