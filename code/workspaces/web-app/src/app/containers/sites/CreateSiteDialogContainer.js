import React from 'react';
import LoadDataStorageModalWrapper from '../modal/LoadDataStorageModalWrapper';
import CreateSiteDialog from '../../components/modal/CreateSiteDialog';

const CreateSiteDialogContainer = props =>
  <LoadDataStorageModalWrapper Dialog={CreateSiteDialog} {...props} />;

export default CreateSiteDialogContainer;
