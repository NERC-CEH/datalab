import { permissionTypes } from 'common';
import { useCurrentUserPermissions } from './authHooks';
import useCurrentUserSystemAdmin from './useCurrentUserSystemAdmin';

jest.mock('./authHooks');

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

describe('useCurrentUserPermissions', () => {
  it('returns undefined if usePermissions is fetching', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      fetching: true,
      error: null,
      value: [],
    });

    expect(useCurrentUserSystemAdmin()).toBeUndefined();
  });

  it('returns true when user is system admin', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      fetching: false,
      error: null,
      value: ['some:permission', SYSTEM_INSTANCE_ADMIN, 'some:other:permission'],
    });

    expect(useCurrentUserSystemAdmin()).toBe(true);
  });

  it('returns false when user is not system admin', () => {
    useCurrentUserPermissions.mockReturnValueOnce({
      fetching: false,
      error: null,
      value: ['some:permission', 'some:other:permission'],
    });

    expect(useCurrentUserSystemAdmin()).toBe(false);
  });
});
