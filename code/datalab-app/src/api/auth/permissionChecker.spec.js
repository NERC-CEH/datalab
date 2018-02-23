import permissionChecker from './permissionChecker';

const user = {
  permissions: [
    'project:elementName:actionName',
  ] };

const actionMock = jest.fn().mockReturnValue(Promise.resolve());

describe('Permission Checker', () => {
  beforeEach(() => jest.clearAllMocks());

  it('throws an error if user is lacking correct permission', () =>
    permissionChecker('elementName:missingActionName', user, () => actionMock('value'))
      .catch((err) => {
        expect(err).toBe('User missing expected permission: project:elementName:missingActionName');
        expect(actionMock).not.toHaveBeenCalled();
      }));

  it('callback to be called if user has correct permission', () =>
    permissionChecker('elementName:actionName', user, () => actionMock('value'))
      .then(() => {
        expect(actionMock).toHaveBeenCalledTimes(1);
        expect(actionMock).toHaveBeenCalledWith('value');
      }));
});
