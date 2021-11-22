import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { change, reset, initialize } from 'redux-form';
import queryString from 'query-string';
import { NOTEBOOK_CATEGORY } from 'common/src/config/images';
import { Typography } from '@material-ui/core';
import projectActions from '../../actions/projectActions';
import stackActions from '../../actions/stackActions';
import assetRepoActions from '../../actions/assetRepoActions';
import { useReduxFormValue } from '../../hooks/reduxFormHooks';
import {
  AddAssetsToNotebookForm,
  FORM_NAME,
  PROJECT_FIELD_NAME,
  NOTEBOOK_FIELD_NAME,
  EXISTING_ASSETS_FIELD_NAME,
  ASSETS_FIELD_NAME,
} from './AddAssetsToNotebookForm';
import modalDialogActions from '../../actions/modalDialogActions';
import { MODAL_TYPE_CONFIRM_CREATION } from '../../constants/modaltypes';
import notify from '../../components/common/notify';
import { useVisibleAssets } from '../../hooks/assetRepoHooks';

const assetInfo = 'Note: Non-public assets will only appear if an allowed project is selected.';

const getProjectOptions = projects => projects.map(p => ({ value: p.key, text: `${p.name} (${p.key})` }));

const getNotebookOptions = (stacks, projectKey) => stacks
  .filter(s => s.projectKey === projectKey && s.category === NOTEBOOK_CATEGORY)
  .map(s => ({ value: s.name, text: `${s.displayName} (${s.name})` }));

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

export const addAssets = (dispatch, history, data) => async () => {
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
    notify.success(`Added ${newAssetsCount} asset(s) to notebook '${notebook}'`, { timeOut: 10000 });
    history.push(`/projects/${project}/notebooks`);
  } catch (e) {
    notify.error('Unable to add asset(s) to notebook.');
  } finally {
    await dispatch(stackActions.loadStacksByCategory(project, NOTEBOOK_CATEGORY));
    await dispatch(assetRepoActions.loadOnlyVisibleAssets(project));
  }
};

export const confirmAddAsset = (dispatch, history) => data => dispatch(modalDialogActions.openModalDialog(MODAL_TYPE_CONFIRM_CREATION, {
  title: 'Add asset(s)',
  body: 'Would you like to add the selected asset(s) to the notebook?',
  onSubmit: addAssets(dispatch, history, data),
  onCancel: () => dispatch(modalDialogActions.closeModalDialog()),
}));

export const getExistingAssets = (dispatch, notebooks, project, notebook) => {
  // When a notebook in a project is selected, get the assets already on the notebook and display them.
  if (project && notebook) {
    const notebookMatch = notebooks.find(s => s.projectKey === project && s.name === notebook);
    if (notebookMatch) {
      const assetsOnNotebook = notebookMatch.assets;
      dispatch(change(FORM_NAME, EXISTING_ASSETS_FIELD_NAME, assetsOnNotebook));
    }
  }
};

export const clearForm = (dispatch, setResetForm) => (notebooks, project, notebook) => () => {
  // "reset" will retain any prefilled project/notebook values from the URL.
  dispatch(reset(FORM_NAME));

  // Flip the "resetForm" state to trigger a useEffect call to make sure the assets are correctly reset.
  setResetForm(prev => !prev);

  //  Make sure the existing assets are still there if necessary.
  getExistingAssets(dispatch, notebooks, project, notebook);
};

export const AddAssetsToNotebookContainer = ({ userPermissions }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { search } = useLocation();

  const selectedProject = useReduxFormValue(FORM_NAME, PROJECT_FIELD_NAME);
  const selectedNotebook = useReduxFormValue(FORM_NAME, NOTEBOOK_FIELD_NAME);

  const projects = useSelector(s => s.projects.value);
  const notebooks = useSelector(s => s.stacks.value);
  const visibleAssets = useVisibleAssets(selectedProject).value.assets;

  const [resetForm, setResetForm] = useState(true);

  useEffect(() => {
    // On page load, get projects.
    dispatch(projectActions.loadProjectsForUser());
  }, [dispatch, projects.isFetching]);

  useEffect(() => {
    // On project selection, get possible notebooks and assets.
    if (selectedProject) {
      dispatch(stackActions.loadStacksByCategory(selectedProject, NOTEBOOK_CATEGORY));
      dispatch(assetRepoActions.loadOnlyVisibleAssets(selectedProject));
    } else {
      dispatch(assetRepoActions.loadAllAssets());
    }
  }, [dispatch, selectedProject, resetForm]);

  useEffect(() => {
    // When project/notebook changes, get existing assets on the selected notebook.
    getExistingAssets(dispatch, notebooks, selectedProject, selectedNotebook);
  }, [dispatch, selectedProject, selectedNotebook, notebooks, projects.isFetching]);

  useEffect(() => {
    // On page load, set the initial project and notebook values from the query string in the URL (if specified).
    const { project, notebook } = queryString.parse(search);

    dispatch(initialize(FORM_NAME, { project, notebook }));
  }, [dispatch, search]);

  useEffect(() => {
    // On page load (or project change), set the asset values from the query string in the URL (if specified).
    //  This is separate from the project/notebook values to avoid a loop of useEffects.
    const { assets: assetIdString } = queryString.parse(search);

    const assetIds = getIdsFromString(assetIdString);
    const prefilledAssets = getPrefilledAssets(assetIds, visibleAssets);

    dispatch(change(FORM_NAME, ASSETS_FIELD_NAME, prefilledAssets));
  }, [dispatch, search, visibleAssets]);

  const projectOptions = getProjectOptions(projects || []);
  const notebookOptions = getNotebookOptions(notebooks || [], selectedProject);

  return (
    <div>
      <Typography variant="body1">
        Add one or multiple assets to a notebook. To choose assets, a project and notebook must first be selected.
        If any assets are selected that already exist on the notebook, these won't be re-added.
        If you cannot see the form, then it likely means you are not part of any projects.
      </Typography>
      <div>
        {projectOptions.length > 0 ? <AddAssetsToNotebookForm
            projectOptions={projectOptions}
            notebookOptions={notebookOptions}
            onSubmit={confirmAddAsset(dispatch, history)}
            handleClear={clearForm(dispatch, setResetForm)}
            assetInfo={assetInfo}
          /> : undefined}
      </div>
    </div>
  );
};
