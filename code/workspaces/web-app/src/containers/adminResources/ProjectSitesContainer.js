import React from 'react';
import { ProjectStacksContainer } from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_EDIT_NOTEBOOK } from '../../constants/modaltypes';
import EditStackForm from '../../components/stacks/EditStackForm';

const CONTAINER_TYPE = 'publish';
const TYPE_NAME = 'Site';
const TYPE_NAME_PLURAL = 'Sites';
const FORM_NAME = 'createSite';

const ProjectSitesContainer = (props) => {
  const { userPermissions, project } = props;
  const projectKey = {
    error: null,
    fetching: false,
    value: project.key,
  };

  return (
  <ProjectStacksContainer
    typeName={TYPE_NAME}
    typeNamePlural={TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_NOTEBOOK}
    editDialogAction={MODAL_TYPE_EDIT_NOTEBOOK}
    formStateName={FORM_NAME}
    formComponent={EditStackForm}
    userPermissions={userPermissions}
    projectKey={projectKey}
  />
  );
};

export default ProjectSitesContainer;
