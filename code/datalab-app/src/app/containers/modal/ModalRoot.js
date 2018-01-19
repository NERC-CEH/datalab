import React from 'react';
import { connect } from 'react-redux';

import CreateNotebookDialog from '../../components/modal/CreateNotebookDialog';
import CreateSiteDialog from '../../components/modal/CreateSiteDialog';
import CreateDataStoreDialog from '../../components/modal/CreateDataStoreDialog';
import Confirmation from '../../components/modal/Confirmation';
import RobustConfirmation from '../../components/modal/RobustConfirmation';

import {
  MODAL_TYPE_CREATE_NOTEBOOK,
  MODAL_TYPE_CREATE_SITE,
  MODAL_TYPE_CONFIRMATION,
  MODAL_TYPE_CREATE_DATA_STORE,
  MODAL_TYPE_ROBUST_CONFIRMATION,
} from '../../constants/modaltypes';

const MODAL_COMPONENTS = {
  [MODAL_TYPE_CREATE_NOTEBOOK]: CreateNotebookDialog,
  [MODAL_TYPE_CREATE_SITE]: CreateSiteDialog,
  [MODAL_TYPE_CONFIRMATION]: Confirmation,
  [MODAL_TYPE_CREATE_DATA_STORE]: CreateDataStoreDialog,
  [MODAL_TYPE_ROBUST_CONFIRMATION]: RobustConfirmation,
};

const ModalRoot = ({ modalType, props }) => {
  if (!modalType) {
    return null;
  }

  const ModalComponent = MODAL_COMPONENTS[modalType];
  return <ModalComponent {...props} />;
};

export default connect(state => state.modal)(ModalRoot);
