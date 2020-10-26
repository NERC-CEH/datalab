import React from 'react';
import { ProjectStacksContainer } from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_NOTEBOOK, MODAL_TYPE_EDIT_NOTEBOOK } from '../../constants/modaltypes';
import EditStackForm from '../../components/stacks/EditStackForm';
import { CONTAINER_TYPE, FORM_NAME, TYPE_NAME, TYPE_NAME_PLURAL } from '../sites/SitesContainer';

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
