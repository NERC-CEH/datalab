const selectCurrentUserId = ({ authentication: { identity: { sub } } }) => sub;
const selectCurrentUserPermissions = ({ authentication: { permissions } }) => permissions;
const selectCurrentUserTokens = ({ authentication: { tokens } }) => tokens;

export default {
  currentUserId: selectCurrentUserId,
  currentUserPermissions: selectCurrentUserPermissions,
  currentUserTokens: selectCurrentUserTokens,
};
