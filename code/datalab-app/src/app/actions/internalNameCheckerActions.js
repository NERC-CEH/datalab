import internalNameCheckerService from '../api/internalNameCheckerService';

export const CHECK_DATASTORE_NAME_ACTION = 'CHECK_DATASTORE_NAME';

const checkNameUniqueness = internalName => ({
  type: CHECK_DATASTORE_NAME_ACTION,
  payload: internalNameCheckerService.checkNameUniqueness(internalName),
});

export default {
  checkNameUniqueness,
};
