import React from 'react';
import { connect } from 'react-redux';

import CreateNotebookDialog from '../../components/modal/CreateNotebookDialog';
import Confirmation from '../../components/modal/Confirmation';

import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_CONFIRMATION } from '../../constants/modaltypes';

const MODAL_COMPONENTS = {
  [MODAL_TYPE_CREATE_NOTEBOOK]: CreateNotebookDialog,
  [MODAL_TYPE_CONFIRMATION]: Confirmation,
};

const ModalRoot = ({ type, props }) => {
  if (!type) {
    return null;
  }

  const ModalComponent = MODAL_COMPONENTS[type];
  return <ModalComponent {...props} />;
};

export default connect(state => state.modal)(ModalRoot);
