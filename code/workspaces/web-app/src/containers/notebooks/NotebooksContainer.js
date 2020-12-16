import React from 'react';
import PropTypes from 'prop-types';
import { NOTEBOOK_CATEGORY } from 'common/src/config/images';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_EDIT_NOTEBOOK } from '../../constants/modaltypes';
import EditStackForm from '../../components/stacks/EditStackForm';
import { NOTEBOOK_TYPE_NAME, NOTEBOOK_TYPE_NAME_PLURAL } from './notebookTypeName';

export const CONTAINER_TYPE = NOTEBOOK_CATEGORY;
export const FORM_NAME = 'createNotebook';

const NotebooksContainer = ({ userPermissions }) => (
  <StacksContainer
    typeName={NOTEBOOK_TYPE_NAME}
    typeNamePlural={NOTEBOOK_TYPE_NAME_PLURAL}
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
