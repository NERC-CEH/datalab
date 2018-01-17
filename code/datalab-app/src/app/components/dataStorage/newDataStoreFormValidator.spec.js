import { syncValidate, asyncValidate } from './newDataStoreFormValidator';

jest.mock('../../actions/dataStorageActions');

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
    const dispatch = () => Promise.resolve({});

    return asyncValidate(values, dispatch)
      .then(() => expect(true).toBe(true));
  });

  it('should return a rejected promise for async errors', () => {
    const values = { name: 'invalidName' };
    const dispatch = () => Promise.resolve({ value: values });

    return asyncValidate(values, dispatch)
      .catch((error) => {
        expect(error).toEqual({ name: 'Data Store already exists. Name must be unique' });
      });
  });
});
