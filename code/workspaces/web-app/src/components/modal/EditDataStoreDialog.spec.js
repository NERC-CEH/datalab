import React from 'react';
import { render, screen } from '../../testUtils/renderTests';
import EditDataStoreDialog, { getOnDetailsEditSubmit } from './EditDataStoreDialog';
import modalDialogActions from '../../actions/modalDialogActions';
import dataStorageActions from '../../actions/dataStorageActions';

jest.mock('../dataStorage/editDataStoreForm', () => props => (<div>EditDataStoreForm mock {JSON.stringify(props)}</div>));

const editDataStoreDetailsMock = jest.fn();
const loadDataStorageMock = jest.fn();
dataStorageActions.editDataStoreDetails = editDataStoreDetailsMock;
dataStorageActions.loadDataStorage = loadDataStorageMock;

describe('Edit data store dialog', () => {
  function shallowRender(props) {
    return render(<EditDataStoreDialog {...props} />).container;
  }

  it('creates correct snapshot', () => {
    // Arrange / Act
    shallowRender({
      onCancel: jest.fn().mockName('onCancel'),
      title: 'expectedTitle',
      currentUsers: [{ label: 'expectedLabelOne', value: 'expectedValueOne' }],
      userList: [{ label: 'expectedLabelTwo', value: 'expectedValueTwo' }],
      loadUsersPromise: {
        error: null,
        fetching: false,
        value: [],
      },
      stack: { name: 'stackName', displayName: 'Stack Display Name', description: 'Stack description' },
      projectKey: 'project99',
      typeName: 'Data Store',
    });

    // Assert
    expect(screen.getByRole('dialog')).toMatchSnapshot();
  });
});

describe('getOnDetailsRequestSubmit returns a function that', () => {
  const projectKey = 'project99';
  const stackName = 'stackname';
  const typeName = 'Data Store';
  const onDetailsEditSubmit = getOnDetailsEditSubmit(projectKey, stackName, typeName);
  const dispatchMock = jest.fn();

  const values = {
    displayName: 'Display Name',
    users: [{ label: 'User One', value: 'userone' }, { label: 'User Two', value: 'usertwo' }],
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('dispatches action to close the modal dialog', async () => {
    await onDetailsEditSubmit(values, dispatchMock);
    expect(dispatchMock).toBeCalledWith(modalDialogActions.closeModalDialog());
  });

  it('dispatches action to update data store details with correct values', async () => {
    const actionReturnValue = { type: 'EDIT_DATA_STORE_ACTION' };
    editDataStoreDetailsMock.mockReturnValue(actionReturnValue);

    await onDetailsEditSubmit(values, dispatchMock);

    expect(dispatchMock).toBeCalledWith(actionReturnValue);
    expect(editDataStoreDetailsMock).toBeCalledWith(
      projectKey, stackName, { displayName: 'Display Name', users: ['userone', 'usertwo'] },
    );
  });

  it('dispatches action to reload the data storage with correct values', async () => {
    const actionReturnValue = { type: 'LOAD_DATA_STORAGE_ACTION' };
    loadDataStorageMock.mockReturnValue(actionReturnValue);

    await onDetailsEditSubmit(values, dispatchMock);

    expect(dispatchMock).toBeCalledWith(actionReturnValue);
    expect(loadDataStorageMock).toBeCalledWith(projectKey);
  });
});
