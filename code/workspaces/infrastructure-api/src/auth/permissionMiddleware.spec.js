import { permissionTypes } from 'common';
import httpMocks from 'node-mocks-http';
import { projectPermissionWrapper, systemAdminPermissionWrapper } from './permissionMiddleware';

const { projectPermissions: { PROJECT_KEY_STACKS_LIST }, SYSTEM_INSTANCE_ADMIN } = permissionTypes;

describe('projectPermissionWrapper', () => {
  describe('when projectKey is provided in request', () => {
    describe('when user has correct project permissions', () => {
      const userPermissions = ['projects:testkey:stacks:list'];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = httpMocks.createRequest({
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user is system admin without correct project permissions', () => {
      const userPermissions = [SYSTEM_INSTANCE_ADMIN];

      it('extracts and uses the projectKey from the params to pass check', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });

      it('extracts and uses the projectKey from the body to pass check', () => {
        const requestMock = httpMocks.createRequest({
          body: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(nextMock).toHaveBeenCalledTimes(1);
      });
    });

    describe('when user does not have correct user permissions or system admin', () => {
      const userPermissions = ['incorrect:permissions'];

      it('fails with 401 and does not call next', () => {
        const requestMock = httpMocks.createRequest({
          params: { projectKey: 'testkey' },
          user: { permissions: userPermissions },
        });
        const responseMock = httpMocks.createResponse();
        const nextMock = jest.fn();

        projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

        expect(responseMock.statusCode).toEqual(401);
        expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
        expect(nextMock).not.toHaveBeenCalled();
      });
    });
  });

  describe('when projectKey not provided', () => {
    it('fails with a 400 and does not call next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [] } });
      const responseMock = httpMocks.createResponse();
      const nextMock = jest.fn();

      projectPermissionWrapper(PROJECT_KEY_STACKS_LIST)(requestMock, responseMock, nextMock);

      expect(responseMock.statusCode).toEqual(400);
      expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});

describe('systemAdminPermissionWrapper', () => {
  describe('when user is system admin', () => {
    it('calls next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [SYSTEM_INSTANCE_ADMIN] } });
      const responseMock = jest.fn();
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(nextMock).toHaveBeenCalledTimes(1);
      expect(responseMock).not.toHaveBeenCalled();
    });
  });

  describe('when user is not system admin', () => {
    it('fails with a 401, error message matching snapshot and does not call next', () => {
      const requestMock = httpMocks.createRequest({ user: { permissions: [] } });
      const responseMock = httpMocks.createResponse();
      const nextMock = jest.fn();

      systemAdminPermissionWrapper()(requestMock, responseMock, nextMock);
      expect(responseMock.statusCode).toEqual(401);
      expect(responseMock._getData()).toMatchSnapshot(); // eslint-disable-line no-underscore-dangle
      expect(nextMock).not.toHaveBeenCalled();
    });
  });
});
