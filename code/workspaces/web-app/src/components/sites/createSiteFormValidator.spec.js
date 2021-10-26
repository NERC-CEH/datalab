import { syncValidate, getAsyncValidate } from './createSiteFormValidator';
import { getSiteInfo } from '../../config/images';

jest.mock('../../actions/internalNameCheckerActions');
jest.mock('../../config/images');

const NAME_FIELD_NAME = 'name';
const TYPE_FIELD_NAME = 'type';

const componentProps = { projectKey: 'test-proj' };

beforeEach(() => {
  getSiteInfo.mockReturnValue({
    rshiny: { displayName: 'RShiny' },
  });
});

describe('New Site Form Validator', () => {
  describe('syncValidate', () => {
    it('should return empty errors object for valid form', () => {
      const values = {
        displayName: 'Display Name',
        type: 'rshiny',
        name: 'name',
        description: 'The site description',
        sourcePath: 'path',
        volumeMount: 'dataStore',
        visible: 'private',
      };

      expect(syncValidate(values)).toBeUndefined();
    });

    it('should return correct errors for empty form', () => {
      const values = {};
      expect(syncValidate(values)).toMatchSnapshot();
    });

    it('should return correct error for invalid type', () => {
      const values = {
        displayName: 'Display Name',
        type: 'no-such-type',
        name: 'name',
        description: 'The site description',
        sourcePath: 'path',
        volumeMount: 'dataStore',
        visible: 'private',
      };

      expect(syncValidate(values)).toMatchSnapshot();
    });
  });

  describe('asyncValidate', () => {
    const asyncValidate = getAsyncValidate(NAME_FIELD_NAME, TYPE_FIELD_NAME);

    it('should return a resolved promise when no async errors', () => {
      const values = { [NAME_FIELD_NAME]: 'validName' };
      const dispatch = () => Promise.resolve({ value: true });

      return asyncValidate(values, dispatch, componentProps, NAME_FIELD_NAME)
        .then(() => expect(true).toBe(true))
        .catch(() => expect(true).toBe(false)); // fail test if error thrown
    });

    describe('validate name', () => {
      it('should return an error if unable to check name uniqueness', () => {
        const dispatch = () => Promise.reject();

        return asyncValidate({ [NAME_FIELD_NAME]: 'unableToCheck' }, dispatch, componentProps, NAME_FIELD_NAME)
          .then(() => expect(true).toBe(false)) // fail test if no error thrown
          .catch(error => expect(error).toEqual({ [NAME_FIELD_NAME]: 'Unable to check if Site URL Name is unique.' }));
      });

      it('should return a rejected promise for async errors', () => {
        const values = { [NAME_FIELD_NAME]: 'invalidName' };
        const dispatch = () => Promise.resolve({ value: false });

        return asyncValidate(values, dispatch, componentProps, NAME_FIELD_NAME)
          .then(() => expect(true).toBe(false)) // fail test if no error thrown
          .catch(error => expect(error).toEqual({ [NAME_FIELD_NAME]: 'Another resource is already using this name and names must be unique.' }));
      });
    });
  });
});
