import React from 'react';
import PropTypes from 'prop-types';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_SITE } from '../../constants/modaltypes';

const CONTAINER_TYPE = 'publish';
const TYPE_NAME = 'Site';
const TYPE_NAME_PLURAL = 'Sites';
const FORM_NAME = 'createSite';

const SitesContainer = ({ userPermissions, projectKey }) => (
  <StacksContainer
    typeName={TYPE_NAME}
    typeNamePlural={TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_SITE}
    formStateName={FORM_NAME}
    userPermissions={userPermissions}
    projectKey={projectKey} />);

SitesContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  projectKey: PropTypes.string.isRequired,
};

export default SitesContainer;
