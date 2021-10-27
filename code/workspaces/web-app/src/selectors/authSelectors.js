const selectCurrentUserId = ({ authentication: { identity: { sub } } }) => sub;
const selectCurrentUserPermissions = ({ authentication: { permissions } }) => permissions;
const selectCurrentUserTokens = ({ authentication: { tokens } }) => tokens;

const authSelectors = {
  currentUserId: selectCurrentUserId,
  currentUserPermissions: selectCurrentUserPermissions,
  currentUserTokens: selectCurrentUserTokens,
};

export default authSelectors;
