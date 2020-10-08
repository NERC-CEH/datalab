import validate from 'validate.js';
import internalNameCheckerActions from '../../actions/internalNameCheckerActions';
import dataStoreValueConstraints from './dataStoreValueConstraints';

validate.formatters.reduxForm = error => error.reduce(errorReducer, {});

function errorReducer(accumulator, error) {
  accumulator[error.attribute] = error.error; // eslint-disable-line no-param-reassign
  return accumulator;
}

export const syncValidate = values => validate(values, dataStoreValueConstraints, { format: 'reduxForm' });

// Catch statement added to prevent submission of creation request without passing uniqueness check.
export const asyncValidate = (values, dispatch, { projectKey }) => dispatch(internalNameCheckerActions.checkNameUniqueness(projectKey, values.name))
  .catch(() => Promise.reject({ name: 'Unable to check if Data Store Name is unique.' }))
  .then((response) => {
    if (!response.value) {
      return Promise.reject({ name: 'Data Store already exists. Name must be unique' });
    }
    return Promise.resolve();
  });
