import React from 'react';
import LoadDataStorageModalWrapper from '../modal/LoadDataStorageModalWrapper';
import CreateNotebookDialog from '../../components/modal/CreateNotebookDialog';

const CreateNotebookDialogContainer = props =>
  <LoadDataStorageModalWrapper Dialog={CreateNotebookDialog} {...props} />;

export default CreateNotebookDialogContainer;
