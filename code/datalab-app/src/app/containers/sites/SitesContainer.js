import React from 'react';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_SITE } from '../../constants/modaltypes';

const CONTAINER_TYPE = 'publish';
const TYPE_NAME = 'Site';
const FORM_NAME = 'createSite';

const SitesContainer = () => (
  <StacksContainer
    typeName={TYPE_NAME}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_SITE}
    formStateName={FORM_NAME} />);

export default SitesContainer;
