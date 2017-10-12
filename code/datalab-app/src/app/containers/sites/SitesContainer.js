import React from 'react';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK } from '../../constants/modaltypes';

const CONTAINER_TYPE = 'publish';
const TYPE_NAME = 'Site';

const SitesContainer = () => (
  <StacksContainer
    typeName={TYPE_NAME}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    formStateName='createSite' />);

export default SitesContainer;
