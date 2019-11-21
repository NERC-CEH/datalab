import { syncValidate, asyncValidate } from './newDataStoreFormValidator';

jest.mock('../../actions/internalNameCheckerActions');

const componentProps = { projectKey: 'testproj' };

describe('New Data Store Form Validator', () => {
  it('should return empty errors object for valid form', () => {
    const values = {
      displayName: 'Display Name',
      type: 'nfs',
      volumeSize: 5,
      name: 'name',
      description: 'data store description',
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
      type: 'nfs',
      volumeSize: 5,
      name: 'ab',
      description: 'data store description',
    };

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return correct error for name with symbol', () => {
    const values = {
      displayName: 'Display Name',
      type: 'nfs',
      volumeSize: 5,
      name: 'abcd!',
      description: 'data store description',
    };

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return correct error for too small a volume size value', () => {
    const values = {
      displayName: 'Display Name',
      type: 'nfs',
      volumeSize: 1,
      name: 'name',
      description: 'data store description',
    };

    expect(syncValidate(values)).toMatchSnapshot();
  });

  it('should return correct error for when volume size is a float', () => {
    const values = {
      displayName: 'Display Name',
      type: 'nfs',
      volumeSize: 10.5,
      name: 'name',
      description: 'data store description',
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
      .catch(error => expect(error).toEqual({ name: 'Data Store already exists. Name must be unique' }));
  });
});
