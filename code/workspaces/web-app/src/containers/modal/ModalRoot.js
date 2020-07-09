import React from 'react';
import { connect } from 'react-redux';

import CreateNotebookDialog from '../notebooks/CreateNotebookDialogContainer';
import CreateSiteDialog from '../sites/CreateSiteDialogContainer';
import CreateDataStoreDialog from '../../components/modal/CreateDataStoreDialog';
import Confirmation from '../../components/modal/Confirmation';
import RobustConfirmation from '../../components/modal/RobustConfirmation';
import EditDataStore from '../dataStorage/EditDataStoreContainer';
import CreateProjectDialog from '../../components/modal/CreateProjectDialog';
import ShareStackDialog from '../../components/modal/ShareStackDialog';
import Logs from '../../components/modal/SiteLogs';

import {
  MODAL_TYPE_CREATE_NOTEBOOK,
  MODAL_TYPE_CREATE_SITE,
  MODAL_TYPE_CONFIRMATION,
  MODAL_TYPE_LOGS,
  MODAL_TYPE_CREATE_DATA_STORE,
  MODAL_TYPE_ROBUST_CONFIRMATION,
  MODAL_TYPE_EDIT_DATA_STORE,
  MODAL_TYPE_CREATE_PROJECT,
  MODAL_TYPE_SHARE_STACK,
} from '../../constants/modaltypes';

const MODAL_COMPONENTS = {
  [MODAL_TYPE_CREATE_NOTEBOOK]: CreateNotebookDialog,
  [MODAL_TYPE_CREATE_SITE]: CreateSiteDialog,
  [MODAL_TYPE_CONFIRMATION]: Confirmation,
  [MODAL_TYPE_CREATE_DATA_STORE]: CreateDataStoreDialog,
  [MODAL_TYPE_ROBUST_CONFIRMATION]: RobustConfirmation,
  [MODAL_TYPE_EDIT_DATA_STORE]: EditDataStore,
  [MODAL_TYPE_CREATE_PROJECT]: CreateProjectDialog,
  [MODAL_TYPE_LOGS]: Logs,
  [MODAL_TYPE_SHARE_STACK]: ShareStackDialog,
};

const ModalRoot = ({ modalType, props }) => {
  if (!modalType) {
    return null;
  }

  const ModalComponent = MODAL_COMPONENTS[modalType];
  return <ModalComponent {...props} />;
};

export default connect(state => state.modal)(ModalRoot);
