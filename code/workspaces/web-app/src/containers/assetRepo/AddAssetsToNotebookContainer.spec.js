import React from 'react';
import { render } from '@testing-library/react';
import * as redux from 'react-redux';
import { MemoryRouter } from 'react-router';
import { AddAssetsToNotebookContainer, confirmAddAsset, addAssets } from './AddAssetsToNotebookContainer';
import * as addAssetsForm from './AddAssetsToNotebookForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';
import stackActions from '../../actions/stackActions';
import notify from '../../components/common/notify';

const renderWithLocation = (location, ComponentToRender, props = {}) => render(
  <MemoryRouter initialEntries={[location]}>
    <ComponentToRender {...props}/>
  </MemoryRouter>,
);

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
    jest.mock('./AddAssetsToNotebookForm');
    addAssetsForm.AddAssetsToNotebookForm = jest.fn(props => <div>{`Form: ${JSON.stringify(props)}`}</div>);

    redux.useDispatch = jest.fn().mockReturnValue(dispatchMock);
    redux.useSelector = selectorMock.mockReturnValue([]);
    reduxFormHooks.useReduxFormValue = jest.fn();
  });

  it('passes the correct props to the form when there are no projects or notebooks', () => {
    const props = {};
    const location = getLocation();

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(2);
  });

  it('passes the correct props to the form when there are projects and notebooks', () => {
    const props = {};
    const location = getLocation();

    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('project1');
    selectorMock
      .mockReturnValueOnce(projects)
      .mockReturnValueOnce(notebooks);

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(3);
  });

  it('passes the correct initialValues to the form', () => {
    const props = {};
    const searchString = 'project=project1&notebook=notebook1&assets=asset1,asset2';
    const location = {
      ...getLocation(),
      search: searchString,
    };

    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('project1');
    selectorMock
      .mockReturnValueOnce(projects)
      .mockReturnValueOnce(notebooks)
      .mockReturnValueOnce(assets);

    const wrapper = renderWithLocation(location, AddAssetsToNotebookContainer, props);

    expect(wrapper.container).toMatchSnapshot();
    expect(dispatchMock).toHaveBeenCalledTimes(3);
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

    await addAssets(dispatch, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 1 asset(s) to notebook');
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

    await addAssets(dispatch, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 0 asset(s) to notebook');
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

    await addAssets(dispatch, data)();

    expect(dispatch).toHaveBeenCalledTimes(4);
    expect(stackActions.editStack).toHaveBeenCalledWith(expectedEditRequest);
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.success).toHaveBeenCalledWith('Added 1 asset(s) to notebook');
  });

  it('notifies of an error if something goes wrong', async () => {
    const data = {
      ...getData(),
      assets: [asset1],
      existingAssets: [],
    };

    dispatch.mockRejectedValueOnce('expected test error');

    await addAssets(dispatch, data)();

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(notify.success).toHaveBeenCalledTimes(0);
    expect(notify.error).toHaveBeenCalledTimes(1);
    expect(notify.error).toHaveBeenCalledWith('Unable to add asset(s) to notebook.');
  });
});

