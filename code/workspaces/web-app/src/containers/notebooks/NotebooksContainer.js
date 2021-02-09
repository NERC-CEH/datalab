import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { NOTEBOOK_CATEGORY } from 'common/src/config/images';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_EDIT_NOTEBOOK } from '../../constants/modaltypes';
import EditNotebookForm from '../../components/notebooks/EditNotebookForm';
import { NOTEBOOK_TYPE_NAME, NOTEBOOK_TYPE_NAME_PLURAL } from './notebookTypeName';
import assetRepoActions from '../../actions/assetRepoActions';

export const CONTAINER_TYPE = NOTEBOOK_CATEGORY;
export const FORM_NAME = 'createNotebook';

const NotebooksContainer = ({ userPermissions }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(assetRepoActions.loadVisibleAssets());
  }, [dispatch]);

  return (
  <StacksContainer
    typeName={NOTEBOOK_TYPE_NAME}
    typeNamePlural={NOTEBOOK_TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    editDialogAction={MODAL_TYPE_EDIT_NOTEBOOK}
    formStateName={FORM_NAME}
    formComponent={EditNotebookForm}
    userPermissions={userPermissions}
  />
  );
};

NotebooksContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default NotebooksContainer;
