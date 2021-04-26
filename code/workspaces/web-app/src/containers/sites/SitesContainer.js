import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { SITE_CATEGORY } from 'common/src/config/images';
import StacksContainer from '../stacks/StacksContainer';
import { MODAL_TYPE_CREATE_SITE, MODAL_TYPE_EDIT_SITE } from '../../constants/modaltypes';
import EditSiteForm from '../../components/sites/EditSiteForm';
import { SITE_TYPE_NAME, SITE_TYPE_NAME_PLURAL } from './siteTypeName';
import assetRepoActions from '../../actions/assetRepoActions';
import { useCurrentProjectKey } from '../../hooks/currentProjectHooks';

export const CONTAINER_TYPE = SITE_CATEGORY;
export const FORM_NAME = 'createSite';

const SitesContainer = ({ userPermissions }) => {
  const dispatch = useDispatch();
  const projectKey = useCurrentProjectKey();

  useEffect(() => {
    !projectKey.fetching && projectKey.value && dispatch(assetRepoActions.loadVisibleAssets(projectKey.value));
  }, [dispatch, projectKey]);

  return (
  <StacksContainer
    typeName={SITE_TYPE_NAME}
    typeNamePlural={SITE_TYPE_NAME_PLURAL}
    containerType={CONTAINER_TYPE}
    dialogAction={MODAL_TYPE_CREATE_SITE}
    editDialogAction={MODAL_TYPE_EDIT_SITE}
    formStateName={FORM_NAME}
    formComponent={EditSiteForm}
    userPermissions={userPermissions} />
  );
};

SitesContainer.propTypes = {
  userPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default SitesContainer;
