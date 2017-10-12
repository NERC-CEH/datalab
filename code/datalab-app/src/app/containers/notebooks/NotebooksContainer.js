import React from 'react';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../../constants/modaltypes';

const CONTAINER_TYPE = 'analysis';
const TYPE_NAME = 'Notebook';

const NotebooksContainer = () => (
  <StacksContainer
    typeName={TYPE_NAME}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    formStateName='createNotebook' />);

export default NotebooksContainer;
