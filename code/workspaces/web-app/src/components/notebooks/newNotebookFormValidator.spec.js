import { syncValidate, asyncValidate } from './newNotebookFormValidator';

jest.mock('../../actions/internalNameCheckerActions');

const componentProps = { projectKey: 'testproj' };

describe('New Notebook Form Validator', () => {
  it('should return empty errors object for valid form', () => {
    const values = {
      displayName: 'Display Name',
      type: 'jupyter',
      name: 'name',
      volumeMount: 'dataStore',
      description: 'The notebook description',
      shared: 'private',
    };

    expect(syncValidate(values)).toBeUndefined();
  });

  it('should return correct errors for empty form', () => {
    const values = {};

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return correct error for short name', () => {
    const values = {
      displayName: 'Display Name',
      type: 'jupyter',
      name: 'abc',
      volumeMount: 'dataStore',
      description: 'The notebook description',
      shared: 'private',
    };

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return correct error for name with symbol', () => {
    const values = {
      displayName: 'Display Name',
      type: 'jupyter',
      name: 'abc!',
      volumeMount: 'dataStore',
      description: 'The notebook description',
      shared: 'private',
    };

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return a resolved promise when no async errors', () => {
    const values = { name: 'validName' };
    const dispatch = () => Promise.resolve({ value: true });

    return asyncValidate(values, dispatch, componentProps)
      .then(() => expect(true).toBe(true))
      .catch(() => expect(true).toBe(false)); // fail test if error thrown
  });

  it('should return an error if unable to check name uniqueness', () => {
    const dispatch = () => Promise.reject();

    return asyncValidate({ name: 'unableToCheck' }, dispatch, componentProps)
      .then(() => expect(true).toBe(false)) // fail test if no error thrown
      .catch(error => expect(error).toEqual({ name: 'Unable to check if Data Store Name is unique.' }));
  });

  it('should return a rejected promise for async errors', () => {
    const values = { name: 'invalidName' };
    const dispatch = () => Promise.resolve({ value: false });

    return asyncValidate(values, dispatch, componentProps)
      .then(() => expect(true).toBe(false)) // fail test if no error thrown
      .catch(error => expect(error).toEqual({ name: 'Another resource is already using this name and names must be unique.' }));
  });
});
