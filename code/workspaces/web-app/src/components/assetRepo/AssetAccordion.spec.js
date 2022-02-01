import React from 'react';
import * as ReactRedux from 'react-redux';
import { reset } from 'redux-form';
import { permissionTypes } from 'common';
import { render, fireEvent, screen, within } from '../../testUtils/renderTests';
import AssetAccordion, { onEditAssetConfirm, onEditAssetSubmit, openEditForm } from './AssetAccordion';
import { useCurrentUserPermissions, useCurrentUserId } from '../../hooks/authHooks';
import notify from '../common/notify';

jest.mock('react-router');
const dispatchMock = jest.fn().mockName('dispatch');
jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  reset: jest.fn(),
}));

jest.mock('../common/notify', () => ({ success: jest.fn(), error: jest.fn() }));
jest.mock('../../api/assetRepoService');

jest.mock('./AssetCard', () => props => (<>{`Asset: ${JSON.stringify(props.asset)}`}</>));
jest.mock('../../hooks/authHooks');

const asset = {
  name: 'asset name',
  version: 'asset version',
  assetId: 'asset-1',
  fileLocation: 'file location',
  masterUrl: 'master URL',
  owners: [{ userId: 'owner-1', name: 'name 1' }, { userId: 'owner-2', name: 'name 2' }],
  visibility: 'BY_PROJECT',
  projects: [{ projectKey: 'project-1', name: 'project 1' }, { projectKey: 'project-2', name: 'project 2' }],
};

describe('AssetAccordion', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useCurrentUserPermissions.mockReturnValue({ value: [permissionTypes.SYSTEM_DATA_MANAGER] });
    useCurrentUserId.mockReturnValue('owner-1');
  });

  it('renders to match snapshot passing correct props to children', () => {
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders with an Edit button when user is not a data manager but is an owner', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.queryAllByText('Edit').length).toEqual(1);
  });

  it('renders with an Edit button when user is a data manager but is not an owner', () => {
    useCurrentUserId.mockReturnValueOnce('other-owner');
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.queryAllByText('Edit').length).toEqual(1);
  });

  it('renders without an Edit button when user is not a data manager or an owner', () => {
    useCurrentUserPermissions.mockReturnValueOnce({ value: [] });
    useCurrentUserId.mockReturnValueOnce('other-owner');
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.queryAllByText('Edit').length).toEqual(0);
  });

  it('opens the more menu when the button is clicked', () => {
    const wrapper = render(<AssetAccordion asset={asset}/>);

    const preClickMenus = screen.queryByRole('menu');
    expect(preClickMenus).toBeNull();

    // Click menu button
    fireEvent.click(wrapper.getByText('more_vert'));

    const menu = screen.getByRole('menu');
    expect(within(menu).queryByText('Add to Notebook')).toMatchSnapshot();
  });
});

describe('openEditForm', () => {
  const dispatch = jest.fn();
  const editPermissions = {};

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches openModalDialog with correct props', () => {
    openEditForm(dispatch, asset, editPermissions);

    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        modalType: 'MODAL_TYPE_EDIT_ASSET',
        props: {
          asset,
          editPermissions,
          onSubmit: expect.any(Function),
          onCancel: expect.any(Function),
          formComponent: expect.any(Object),
        },
      },
      type: 'OPEN_MODAL_DIALOG',
    });
  });
});

describe('onEditAssetSubmit', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches openModalDialog with correct props', async () => {
    await onEditAssetSubmit(dispatch)(asset);

    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLOSE_MODAL_DIALOG',
    });
    expect(dispatch).toHaveBeenCalledWith({
      payload: {
        modalType: 'MODAL_TYPE_CONFIRMATION',
        props: {
          title: 'Edit permissions for asset \'asset name:asset version (file location)\'',
          body: 'Are you sure you want to change permissions?  Note that changing permissions will affect existing notebooks etc.',
          confirmText: 'Confirm Change',
          confirmIcon: 'check',
          onSubmit: expect.any(Function),
          onCancel: expect.any(Function),
        },
      },
      type: 'OPEN_MODAL_DIALOG',
    });
  });
});

describe('onEditAssetConfirm', () => {
  const dispatch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('dispatches the correct actions on success', async () => {
    await onEditAssetConfirm(dispatch, asset);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLOSE_MODAL_DIALOG',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'EDIT_REPO_METADATA_ACTION',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOAD_ASSETS_FOR_USER_ACTION',
    });
    expect(reset).toHaveBeenCalledTimes(1);
    expect(reset).toHaveBeenCalledWith('editAssetDetails');
    expect(notify.success).toHaveBeenCalledTimes(1);
    expect(notify.error).toHaveBeenCalledTimes(0);
  });

  it('dispatches the correct actions on failure', async () => {
    dispatch
      .mockImplementationOnce()
      .mockImplementationOnce(() => { throw Error('expected test error'); });

    await onEditAssetConfirm(dispatch, asset);

    expect(dispatch).toHaveBeenCalledTimes(3);
    expect(dispatch).toHaveBeenCalledWith({
      type: 'CLOSE_MODAL_DIALOG',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'EDIT_REPO_METADATA_ACTION',
    });
    expect(dispatch).toHaveBeenCalledWith({
      type: 'LOAD_ASSETS_FOR_USER_ACTION',
    });
    expect(reset).toHaveBeenCalledTimes(0);
    expect(notify.success).toHaveBeenCalledTimes(0);
    expect(notify.error).toHaveBeenCalledTimes(1);
  });
});
