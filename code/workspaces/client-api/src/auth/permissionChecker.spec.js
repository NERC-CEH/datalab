import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { permissionWrapper, multiPermissionsWrapper, instanceAdminWrapper, projectPermissionWrapper } from './permissionChecker';

const user = {
  permissions: [
    'project:elementName:actionName',
  ],
};

const admin = {
  permissions: [
    'system:instance:admin',
  ],
};

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

const next = () => actionMock('value');

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('permissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () => permissionWrapper('elementName:missingActionName', user, next)
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has correct permission', () => permissionWrapper('elementName:actionName', user, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => permissionWrapper('elementName:actionName', admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('multiPermissionWrapper', () => {
    it('throws an error if user is lacking correct permission', () => multiPermissionsWrapper(['elementName:missingActionName', 'elementName:anotherAction'], user, next)
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,project:elementName:anotherAction,system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has correct permission', () => multiPermissionsWrapper(['elementName:actionName', 'elementName:anotherAction'], user, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));

    it('callback to be called if user has instance admin permission', () => multiPermissionsWrapper(['elementName:actionName'], admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('instanceAdminWrapper', () => {
    it('throws an error if user is lacking correct permission', () => instanceAdminWrapper(user, next)
      .catch((err) => {
        expect(err).toEqual(new Error('User missing expected permission(s): system:instance:admin'));
        expect(actionMock).not.toHaveBeenCalled();
      }));

    it('callback to be called if user has instance admin permission', () => instanceAdminWrapper(admin, next)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
  });

  describe('projectPermissionWrapper', () => {
    const httpMock = new MockAdapter(axios);

    beforeEach(() => {
      httpMock.reset();
    });

    afterAll(() => {
      httpMock.restore();
    });

    it('throws an error if user is lacking user permission', () => {
      httpMock.onGet('http://localhost:9000/projects/project2/is-member').reply(200, true);
      projectPermissionWrapper('project2', 'elementName:missingActionName', 'token', user, next)
        .catch((err) => {
          expect(err).toEqual(new Error('User missing expected permission(s): project:elementName:missingActionName,system:instance:admin'));
          expect(actionMock).not.toHaveBeenCalled();
        });
    });

    it('throws an error if user is lacking project permission', () => {
      httpMock.onGet('http://localhost:9000/projects/projectX/is-member').reply(200, false);
      projectPermissionWrapper('projectX', 'elementName:actionName', 'token', user, next)
        .catch((err) => {
          expect(err).toEqual(new Error('Requested projectKey projectX not accessible to user'));
          expect(actionMock).not.toHaveBeenCalled();
        });
    });

    it('throws an error if user has instance admin permission but is lacking project permission', () => {
      httpMock.onGet('http://localhost:9000/projects/projectX/is-member').reply(200, false);
      projectPermissionWrapper('projectX', 'elementName:actionName', 'token', admin, next)
        .catch((err) => {
          expect(err).toEqual(new Error('Requested projectKey projectX not accessible to user'));
          expect(actionMock).not.toHaveBeenCalled();
        });
    });

    it('callback to be called if user has correct user and project permission', () => {
      httpMock.onGet('http://localhost:9000/projects/project2/is-member').reply(200, true);
      projectPermissionWrapper('project2', 'elementName:actionName', 'token', user, next)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });

    it('callback to be called if user has instance admin permission with project permission', () => {
      httpMock.onGet('http://localhost:9000/projects/project2/is-member').reply(200, true);
      projectPermissionWrapper('project2', 'elementName:actionName', 'token', admin, next)
        .then(() => {
          expect(actionMock).toHaveBeenCalledTimes(1);
          expect(actionMock).toHaveBeenCalledWith('value');
        });
    });
  });
});
