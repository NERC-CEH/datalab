import React from 'react';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../../constants/modaltypes';

const CONTAINER_TYPE = 'analysis';
const TYPE_NAME = 'Notebook';
const FORM_NAME = 'createNotebook';

const NotebooksContainer = () => (
  <StacksContainer
    typeName={TYPE_NAME}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    formStateName={FORM_NAME} />);

export default NotebooksContainer;
