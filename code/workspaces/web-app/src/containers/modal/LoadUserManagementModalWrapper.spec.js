import React from 'react';
import { shallow } from 'enzyme';
import { useDispatch, useSelector } from 'react-redux';
import LoadUserManagementModalWrapper from './LoadUserManagementModalWrapper';
import listUsersService from '../../api/listUsersService';
import { useProjectUsers } from '../../hooks/projectUsersHooks';

// https://github.com/enzymejs/enzyme/issues/2086#issuecomment-579510955
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: f => f(),
}));
jest.mock('react-redux');
jest.mock('../../api/listUsersService');
jest.mock('../../hooks/projectUsersHooks');

const projectUsers = {
  fetching: { inProgress: false },
  value: [
    { userId: 'expectedId', name: 'expectedName' },
    { userId: 'anotherExpectedId', name: 'anotherExpectedName' },
  ],
};
const dataStorage = { users: ['expectedId'] };

let listUsersMock;

beforeEach(() => {
  listUsersMock = jest.fn().mockReturnValue(Promise.resolve('expectedPayload'));
  listUsersService.listUsers = listUsersMock;

  useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));

  useProjectUsers.mockReturnValue(projectUsers);

  // dataStorage object
  useSelector.mockReturnValue(dataStorage);
});

describe('LoadUserManagement Modal Wrapper', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('is a container which', () => {
    const onCancelMock = jest.fn();

    const generateProps = () => ({
      title: 'Title',
      onCancel: onCancelMock,
      Dialog: () => {},
      dataStoreId: 'expectedDataId',
      projectKey: 'project99',
      userKeysMapping: {
        userId: 'value',
        name: 'label',
      },
      stack: { displayName: 'displayName', description: 'description' },
      typeName: 'Data Store',
    });

    it('calls listUsers action when rendered', () => {
      // Arrange
      const props = generateProps();

      // Act
      shallow(<LoadUserManagementModalWrapper {...props} />);

      // Assert
      expect(listUsersMock).toHaveBeenCalledTimes(1);
    });

    it('creates correct snapshot', () => {
      // Arrange
      const props = generateProps();

      // Act
      const output = shallow(<LoadUserManagementModalWrapper {...props} />);

      // Assert
      expect(output).toMatchSnapshot();
    });
  });
});
