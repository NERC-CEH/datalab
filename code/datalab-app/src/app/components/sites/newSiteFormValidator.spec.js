import { syncValidate, asyncValidate } from './newSiteFormValidator';

jest.mock('../../actions/stackActions');

describe('New Site Form Validator', () => {
  it('should return empty errors object for valid form', () => {
    const values = {
      displayName: 'Display Name',
      type: 'jupyter',
      name: 'name',
      description: 'The notebook description',
      sourcePath: 'path',
      volumeMount: 'dataStore',
    };

    expect(syncValidate(values)).toBeUndefined();
  });

  it('should return correct errors for empty form', () => {
    const values = {};

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
        expect(error).toEqual({ name: 'Site already exists. Name must be unique' });
      });
  });
});
