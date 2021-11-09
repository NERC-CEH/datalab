import React from 'react';
import { render } from '@testing-library/react';
import * as redux from 'react-redux';
import { MemoryRouter } from 'react-router';
import { change, reset, initialize } from 'redux-form';
import { AddAssetsToNotebookContainer, confirmAddAsset, addAssets, getExistingAssets, clearForm } from './AddAssetsToNotebookContainer';
import * as addAssetsForm from './AddAssetsToNotebookForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';
import * as assetRepoHooks from '../../hooks/assetRepoHooks';
import stackActions from '../../actions/stackActions';
import assetRepoActions from '../../actions/assetRepoActions';
import notify from '../../components/common/notify';
import stackService from '../../api/stackService';

const renderWithLocation = (location, ComponentToRender, props = {}) => render(
  <MemoryRouter initialEntries={[location]}>
    <ComponentToRender {...props}/>
  </MemoryRouter>,
);

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  change: jest.fn(),
  reset: jest.fn(),
  initialize: jest.fn(),
}));

jest.mock('../../api/projectsService');
jest.mock('../../api/stackService');
jest.mock('../../api/assetRepoService');

beforeEach(() => {
  stackService.loadStacksByCategory.mockResolvedValue([]);
});

describe('AddAssetsToNotebookContainer', () => {
  const dispatchMock = jest.fn().mockName('dispatch');
  const selectorMock = jest.fn();

  const getLocation = () => ({
    pathname: '',
    search: '',
  });

  const projects = [
    {
      key: 'project1',
      name: 'project1',
    },
    {
      key: 'project2',
      name: 'project2',
    },
  ];
  const notebooks = [
    {
      projectKey: 'project1',
      category: 'ANALYSIS',
      name: 'n1',
      displayName: 'notebook1',
    },
  ];
  const assets = [
    {
      assetId: 'asset1',
    },
    {
      assetId: 'asset2',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mock('react-redux');
    jest.mock('react-router');
    jest.mock('../../hooks/reduxFormHooks');
    jest.mock('../../hooks/assetRepoHooks');
    jest.mock('../../actions/assetRepoActions');
    jest.mock('./AddAssetsToNotebookForm');
    addAssetsForm.AddAssetsToNotebookForm = jest.fn(props => <div>{`Form: ${JSON.stringify(props)}`}</div>);

    redux.useDispatch = jest.fn().mockReturnValue(dispatchMock);
    redux.useSelector = selectorMock.mockReturnValue([]);
    reduxFormHooks.useReduxFormValue = jest.fn();
    assetRepoHooks.useVisibleAssets = jest.fn().mockReturnValue({ value: { assets: [] } });
    assetRepoActions.loadAllAssets = jest.fn();
    assetRepoActions.loadOnlyVisibleAssets = jest.fn();
  });

  it('passes the correct props to the form when there are no projects or notebooks', () => {
    const props = {};
    const location = getLocation();

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(4);
    expect(assetRepoActions.loadAllAssets).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledWith('addAssetsToNotebook', { project: undefined, notebook: undefined });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'assets', []);
  });

  it('passes the correct props to the form when there are projects and notebooks and a project is selected', () => {
    const props = {};
    const location = getLocation();

    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('project1');
    selectorMock
      .mockReturnValueOnce(projects)
      .mockReturnValueOnce(notebooks);

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(5);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledTimes(1);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledWith('project1');
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledWith('addAssetsToNotebook', { project: undefined, notebook: undefined });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'assets', []);
  });

  it('initialises correctly when project and notebook are specified in the URL', () => {
    const props = {};
    const searchString = 'project=project1&notebook=notebook1';
    const location = {
      ...getLocation(),
      search: searchString,
    };

    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('project1');
    assetRepoHooks.useVisibleAssets = jest.fn().mockReturnValue({ value: { assets } });
    selectorMock
      .mockReturnValueOnce(projects)
      .mockReturnValueOnce(notebooks);

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(5);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledTimes(1);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledWith('project1');
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledWith('addAssetsToNotebook', { project: 'project1', notebook: 'notebook1' });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'assets', []);
  });

  it('initialises correctly when all properties are specified in the URL', () => {
    const props = {};
    const searchString = 'project=project1&notebook=notebook1&assets=asset1,asset2';
    const location = {
      ...getLocation(),
      search: searchString,
    };

    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('project1');
    assetRepoHooks.useVisibleAssets = jest.fn().mockReturnValue({ value: { assets } });
    selectorMock
      .mockReturnValueOnce(projects)
      .mockReturnValueOnce(notebooks);

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(5);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledTimes(1);
    expect(assetRepoActions.loadOnlyVisibleAssets).toHaveBeenCalledWith('project1');
    expect(initialize).toHaveBeenCalledTimes(1);
    expect(initialize).toHaveBeenCalledWith('addAssetsToNotebook', { project: 'project1', notebook: 'notebook1' });
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'assets', assets);
  });
});

describe('confirmAddAsset', () => {
  it('creates the correct dialog', () => {
    const dispatch = jest.fn();
    const data = {};

    const expectedPayload = {
      modalType: 'MODAL_TYPE_CONFIRM_CREATION',
      props: {
        title: 'Add asset(s)',
        body: 'Would you like to add the selected asset(s) to the notebook?',
        onSubmit: expect.any(Function),
        onCancel: expect.any(Function),
      },
    };

    confirmAddAsset(dispatch)(data);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'OPEN_MODAL_DIALOG',
      payload: expectedPayload,
    });
  });
});

describe('addAssets', () => {
  const dispatch = jest.fn();
  const history = {
    push: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock('../../actions/stackActions');
    jest.mock('../../components/common/notify');

    stackActions.editStack = jest.fn();
    notify.success = jest.fn();
    notify.error = jest.fn();
  });

  const getData = () => ({
    project: 'project1',
    notebook: 'notebook1',
    assets: [],
    existingAssets: [],
  });

  const asset1 = {
    assetId: 'a1',
  };
  const asset2 = {
    assetId: 'a2',
  };

  const getExpectedEditRequest = () => ({
    projectKey: 'project1',
    name: 'notebook1',
    assets: [],
  });

  it('merges assets and dispatches the update', async () => {
    const data = {
      ...getData(),
      assets: [asset1, asset2],
      existingAssets: [asset1],
    };
    const expectedEditRequest = {
      ...getExpectedEditRequest(),
      assets: [asset1, asset2],
    };

    await addAssets(dispatch, history, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 1 asset(s) to notebook \'notebook1\'', { timeOut: 10000 });
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/projects/project1/notebooks');
  });

  it('handles case where no new assets are added', async () => {
    const data = {
      ...getData(),
      assets: [],
      existingAssets: [asset1, asset2],
    };
    const expectedEditRequest = {
      ...getExpectedEditRequest(),
      assets: [asset1, asset2],
    };

    await addAssets(dispatch, history, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 0 asset(s) to notebook \'notebook1\'', { timeOut: 10000 });
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/projects/project1/notebooks');
  });

  it('handles case where there were no existing assets', async () => {
    const data = {
      ...getData(),
      assets: [asset1],
      existingAssets: [],
    };
    const expectedEditRequest = {
      ...getExpectedEditRequest(),
      assets: [asset1],
    };

    await addAssets(dispatch, history, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 1 asset(s) to notebook \'notebook1\'', { timeOut: 10000 });
    expect(history.push).toHaveBeenCalledTimes(1);
    expect(history.push).toHaveBeenCalledWith('/projects/project1/notebooks');
  });

  it('notifies of an error if something goes wrong', async () => {
    const data = {
      ...getData(),
      assets: [asset1],
      existingAssets: [],
    };

    dispatch.mockRejectedValueOnce('expected test error');

    await addAssets(dispatch, history, data)();

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(notify.success).toHaveBeenCalledTimes(0);
    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(notify.error).toHaveBeenCalledWith('Unable to add asset(s) to notebook.');
    expect(history.push).toHaveBeenCalledTimes(0);
  });
});

describe('getExistingAssets', () => {
  const dispatch = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('does nothing if there is no project', () => {
    getExistingAssets(dispatch, [], undefined, undefined);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  it('does nothing if there is no notebook', () => {
    getExistingAssets(dispatch, [], 'project', undefined);
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  it('does nothing if there is no notebook match', () => {
    const notebooks = [{ projectKey: 'project', name: 'other' }];
    getExistingAssets(dispatch, notebooks, 'project', 'notebook');
    expect(dispatch).toHaveBeenCalledTimes(0);
  });

  it('dispatches change request if there is a notebook match', () => {
    const assets = [{ assetId: 'asset1' }];
    const notebooks = [{ projectKey: 'project', name: 'notebook', assets }];
    getExistingAssets(dispatch, notebooks, 'project', 'notebook');
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'existingAssets', assets);
  });
});

describe('clearForm', () => {
  const dispatch = jest.fn();
  const setResetForm = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('dispatches correct actions', () => {
    const assets = [{ assetId: 'asset1' }];
    const notebooks = [{ projectKey: 'project', name: 'notebook', assets }];
    clearForm(dispatch, setResetForm)(notebooks, 'project', 'notebook')();

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(reset).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledWith('addAssetsToNotebook');
    expect(setResetForm).toHaveBeenCalledTimes(1);
    expect(setResetForm).toHaveBeenCalledWith(expect.any(Function));
    expect(change).toHaveBeenCalledTimes(1);
    expect(change).toHaveBeenCalledWith('addAssetsToNotebook', 'existingAssets', assets);
  });
});
