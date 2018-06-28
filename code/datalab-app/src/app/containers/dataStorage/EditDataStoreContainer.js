import React from 'react';
import LoadUserManagementModalWrapper from '../modal/LoadUserManagementModalWrapper';
import EditDataStoreDialog from '../../components/modal/EditDataStoreDialog';

const EditDataStoreContainer = props =>
  <LoadUserManagementModalWrapper Dialog={EditDataStoreDialog} {...props} />;

export default EditDataStoreContainer;
