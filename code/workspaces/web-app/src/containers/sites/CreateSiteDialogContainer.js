import React from 'react';
import CreateStacksModalWrapper from '../modal/CreateStacksModalWrapper';
import CreateSiteDialog from '../../components/modal/CreateSiteDialog';

const CreateSiteDialogContainer = props => <CreateStacksModalWrapper Dialog={CreateSiteDialog} {...props} />;

export default CreateSiteDialogContainer;
