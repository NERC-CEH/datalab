import { permissionTypes } from 'common';
import { useCurrentUserPermissions } from './authHooks';

const { SYSTEM_INSTANCE_ADMIN } = permissionTypes;

const useCurrentUserSystemAdmin = () => {
  const userPermissions = useCurrentUserPermissions();

  if (userPermissions.fetching) {
    return undefined;
  }

  return userPermissions.value.includes(SYSTEM_INSTANCE_ADMIN);
};

export default useCurrentUserSystemAdmin;
