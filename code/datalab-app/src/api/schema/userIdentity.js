import UserType from '../types/userType';
import userIdentityRepository from '../dataaccess/userIdentityService';

const userIdentity = {
  description: 'Provides identity details of the currently logged in user.',
  type: UserType,
  resolve: (obj, params, { authZeroToken }) => userIdentityRepository.getUserInfo(authZeroToken),
};

export default userIdentity;
