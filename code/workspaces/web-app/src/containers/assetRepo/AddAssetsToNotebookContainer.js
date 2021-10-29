import React, { useEffect } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import queryString from 'query-string';
import { NOTEBOOK_CATEGORY } from 'common/src/config/images';
import projectActions from '../../actions/projectActions';
import stackActions from '../../actions/stackActions';
import assetRepoActions from '../../actions/assetRepoActions';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import { AddAssetsToNotebookForm, FORM_NAME, PROJECT_FIELD_NAME, NOTEBOOK_FIELD_NAME, ASSETS_FIELD_NAME } from './AddAssetsToNotebookForm';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CONFIRM_CREATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';

const getProjectOptions = projects => projects.map(p => ({ value: p.key, text: `${p.name} (${p.key})` }));

const getNotebookOptions = (stacks, projectKey) => stacks
  .filter(s => s.projectKey === projectKey && s.category === NOTEBOOK_CATEGORY)
  .map(s => ({ value: s.name, text: `${s.displayName} (${s.name})` }));

const getInitialValues = (project, notebook, assets) => ({
  [PROJECT_FIELD_NAME]: project,
  [NOTEBOOK_FIELD_NAME]: notebook,
  [ASSETS_FIELD_NAME]: assets,
});

const getIdsFromString = (idString) => {
  // If any assets are passed in the URL, they will be of the form:
  //  ?...&assets=assetId1,assetId2
  if (!idString) {
    return [];
  }

  return idString.split(',');
};

const getPrefilledAssets = (assetIds, visibleAssets) => {
  // Get the full asset from the list of IDs.
  if (!assetIds) {
    return [];
  }

  return visibleAssets.filter(a => assetIds.includes(a.assetId));
};

const mergeAssets = (existingAssets, incomingAssets) => {
  if (!existingAssets) {
    return incomingAssets;
  }

  const existingAssetIds = existingAssets.map(a => a.assetId);
  const newAssets = incomingAssets.filter(a => !existingAssetIds.includes(a.assetId));

  return {
    assets: [...existingAssets, ...newAssets],
    newAssetsCount: newAssets.length,
  };
};

export const addAssets = (dispatch, data) => async () => {
  const { project, notebook, assets, existingAssets } = data;

  // Filter out any existing assets and only add new ones.
  const { assets: allAssets, newAssetsCount } = mergeAssets(existingAssets, assets);

  // undefined fields are not updated.
  const editRequest = {
    projectKey: project,
    name: notebook,
    assets: allAssets,
    description: undefined,
    displayName: undefined,
    shared: undefined,
  };

  try {
    await dispatch(stackActions.editStack(editRequest));
    await dispatch(modalDialogActions.closeModalDialog());
    notify.success(`Added ${newAssetsCount} asset(s) to notebook`);
  } catch (e) {
    notify.error('Unable to add asset(s) to notebook.');
  } finally {
    await dispatch(stackActions.loadStacksByCategory(project, NOTEBOOK_CATEGORY));
    await dispatch(assetRepoActions.loadVisibleAssets(project));
  }
};

export const confirmAddAsset = dispatch => data => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRM_CREATION, {
  title: 'Add asset(s)',
  body: 'Would you like to add the selected asset(s) to the notebook?',
  onSubmit: addAssets(dispatch, data),
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
}));

export const AddAssetsToNotebookContainer = ({ userPermissions }) => {
  const projectValue = useReduxFormValue(FORM_NAME, PROJECT_FIELD_NAME);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const projects = useSelector(s => s.projects.value);
  const notebooks = useSelector(s => s.stacks.value);
  const visibleAssets = useSelector(s => s.assetRepo.value.assets);

  const { project, notebook, assets: assetIdString } = queryString.parse(search);

  useEffect(() => {
    dispatch(projectActions.loadProjects());
    dispatch(stackActions.loadStacksByCategory(projectValue, NOTEBOOK_CATEGORY));

    if (projectValue) {
      dispatch(assetRepoActions.loadVisibleAssets(projectValue));
    }
  }, [dispatch, projectValue, projects.isFetching]);

  const projectOptions = getProjectOptions(projects || []);
  const notebookOptions = getNotebookOptions(notebooks || [], projectValue);

  const assetIds = getIdsFromString(assetIdString);
  const prefilledAssets = getPrefilledAssets(assetIds, visibleAssets);
  const initialValues = getInitialValues(project, notebook, prefilledAssets);

  return (
    <AddAssetsToNotebookForm
      projectOptions={projectOptions}
      notebookOptions={notebookOptions}
      onSubmit={confirmAddAsset(dispatch)}
      initialValues={initialValues}
    />
  );
};
