const selectCurrentUserId = ({ authentication: { identity: { sub } } }) => sub;
const selectCurrentUserPermissions = ({ authentication: { permissions } }) => permissions;

export default {
  currentUserId: selectCurrentUserId,
  currentUserPermissions: selectCurrentUserPermissions,
};
