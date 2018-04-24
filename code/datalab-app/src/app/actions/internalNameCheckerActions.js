import internalNameCheckerService from '../api/internalNameCheckerService';

export const CHECK_NAME_UNIQUE_ACTION = 'CHECK_NAME_UNIQUE';

const checkNameUniqueness = internalName => ({
  type: CHECK_NAME_UNIQUE_ACTION,
  payload: internalNameCheckerService.checkNameUniqueness(internalName),
});

export default {
  checkNameUniqueness,
};
