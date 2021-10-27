import internalNameCheckerService from '../api/internalNameCheckerService';

export const CHECK_NAME_UNIQUE_ACTION = 'CHECK_NAME_UNIQUE';

const checkNameUniqueness = (projectKey, internalName) => ({
  type: CHECK_NAME_UNIQUE_ACTION,
  payload: internalNameCheckerService.checkNameUniqueness(projectKey, internalName),
});

const internalNameCheckerActions = {
  checkNameUniqueness,
};

export default internalNameCheckerActions;
