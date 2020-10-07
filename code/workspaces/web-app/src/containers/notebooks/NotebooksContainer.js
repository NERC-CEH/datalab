import React from 'react';
import PropTypes from 'prop-types';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_EDIT_NOTEBOOK } from '../../constants/modaltypes';
import EditStackForm from '../../components/stacks/EditStackForm';

const CONTAINER_TYPE = 'analysis';
const TYPE_NAME = 'Notebook';
const TYPE_NAME_PLURAL = 'Notebooks';
const FORM_NAME = 'createNotebook';

const NotebooksContainer = ({ userPermissions }) => (
  <StacksContainer
    typeName={TYPE_NAME}
    typeNamePlural={TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    editDialogAction={MODAL_TYPE_EDIT_NOTEBOOK}
    formStateName={FORM_NAME}
    formComponent={EditStackForm}
    userPermissions={userPermissions}
  />
);

NotebooksContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NotebooksContainer;
