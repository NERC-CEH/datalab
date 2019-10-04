import React from 'react';
import CreateStacksModalWrapper from '../modal/CreateStacksModalWrapper';
import CreateNotebookDialog from '../../components/modal/CreateNotebookDialog';

const CreateNotebookDialogContainer = props => <CreateStacksModalWrapper Dialog={CreateNotebookDialog} {...props} />;

export default CreateNotebookDialogContainer;
