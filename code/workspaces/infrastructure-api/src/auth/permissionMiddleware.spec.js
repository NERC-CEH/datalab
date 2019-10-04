import { permissionTypes } from 'common';
import { projectPermissionWrapper, systemAdminPermissionWrapper } from './permissionMiddleware';

const { projectPermissions: { PROJECT_KEY_STACKS_LIST }, SYSTEM_INSTANCE_ADMIN } = permissionTypes;

describe('projectPermissionWrapper', () => {
  describe('when projectKey is provided in request', () => {
    describe('when user has correct project permissions', () => {
      const userPermissions = ['projects:testkey:stacks:list'];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = {
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        };
        const responseMock = jest.fn();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = {
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        };
        const responseMock = jest.fn();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user is system admin without correct project permissions', () => {
      const userPermissions = [SYSTEM_INSTANCE_ADMIN];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = {
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        };
        const responseMock = jest.fn();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = {
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        };
        const responseMock = jest.fn();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user does not have correct user permissions or system admin', () => {
      const userPermissions = ['incorrect:permissions'];

      it('fails with 401 and does not call next', () => {
        const requestMock = {
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        };
        const sendMock = jest.fn(() => ({ end: () => {} }));
        const statusMock = jest.fn(() => ({ send: sendMock }));
        const responseMock = { status: statusMock };
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(statusMock).toHaveBeenCalledWith(401);
        expect(sendMock).toHaveBeenCalledTimes(1);
        expect(sendMock.mock.calls[0]).toMatchSnapshot();
        expect(nextMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when projectKey not provided', () => {
    it('fails with a 400 and does not call next', () => {
      const requestMock = { user: { permissions: [] } };
      const sendMock = jest.fn();
      const statusMock = jest.fn(() => ({ send: sendMock }));
      const responseMock = { status: statusMock };
      const nextMock = jest.fn();

      projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock.mock.calls[0]).toMatchSnapshot();
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});

describe('systemAdminPermissionWrapper', () => {
  describe('when user is system admin', () => {
    it('calls next', () => {
      const requestMock = { user: { permissions: [SYSTEM_INSTANCE_ADMIN] } };
      const responseMock = jest.fn();
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(responseMock).not.toHaveBeenCalled();
    });
  });

  describe('when user is not system admin', () => {
    it('fails with a 401, error message matching snapshot and does not call next', () => {
      const requestMock = { user: { permissions: [] } };
      const sendMock = jest.fn(() => ({ end: jest.fn() }));
      const statusMock = jest.fn(() => ({ send: sendMock }));
      const responseMock = { status: statusMock };
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(statusMock).toHaveBeenCalledWith(401);
      expect(sendMock).toHaveBeenCalledTimes(1);
      expect(sendMock.mock.calls[0]).toMatchSnapshot();
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
