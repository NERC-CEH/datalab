const selectCurrentUserId = ({ authentication: { identity: { sub } } }) => sub;

export default {
  currentUserId: selectCurrentUserId,
};
