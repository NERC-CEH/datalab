import httpMocks from 'node-mocks-http';
import permissionWrapper from './permissionCheckerMiddleware';

jest.mock('winston');

const request = {
  user: {
    permissions: [
      'project:elementName:actionName',
    ],
  },
};

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('callback to be called if user has correct permission', () => {
    const response = httpMocks.createResponse();

    expect(actionMock).not.toHaveBeenCalled();
    return permissionWrapper(['elementName:actionName'])(request, response, actionMock)
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(response.statusCode).toBe(200);
      });
  });

  it('throws an error if user is lacking correct permission', () => {
    const response = httpMocks.createResponse();

    expect(actionMock).not.toHaveBeenCalled();
    permissionWrapper(['elementName:missingActionName'])(request, response, actionMock);
    expect(actionMock).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(401);
    expect(response._getData()) // eslint-disable-line no-underscore-dangle
      .toEqual({ message: 'User missing expected permission(s): project:elementName:missingActionName' });
  });

  it('throws error for shortened permission name', () => {
    const response = httpMocks.createResponse();

    expect(actionMock).not.toHaveBeenCalled();
    permissionWrapper(['elementName:actionNam'])(request, response, actionMock);
    expect(actionMock).not.toHaveBeenCalled();
    expect(response.statusCode).toBe(401);
    expect(response._getData()) // eslint-disable-line no-underscore-dangle
      .toEqual({ message: 'User missing expected permission(s): project:elementName:actionNam' });
  });
});
