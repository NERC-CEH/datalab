import { syncValidate, getAsyncValidate } from './newNotebookFormValidator';
import { getNotebookInfo } from '../../config/images';

jest.mock('../../actions/internalNameCheckerActions');
jest.mock('../../config/images');

const NAME_FIELD_NAME = 'name';
const TYPE_FIELD_NAME = 'type';

const componentProps = { projectKey: 'testproj' };

describe('New Notebook Form Validator', () => {
  describe('syncValidate', () => {
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
  });

  describe('asyncValidate', () => {
    const asyncValidate = getAsyncValidate(NAME_FIELD_NAME, TYPE_FIELD_NAME);

    it('should return a resolved promise when no async errors', () => {
      const values = { [NAME_FIELD_NAME]: 'validName', [TYPE_FIELD_NAME]: 'validType' };
      const dispatch = () => Promise.resolve({ value: true });

      return asyncValidate(values, dispatch, componentProps)
        .then(() => expect(true).toBe(true))
        .catch(() => expect(true).toBe(false)); // fail test if error thrown
    });

    describe('validate name', () => {
      it('should return an error if unable to check name uniqueness', async () => {
        const dispatch = () => Promise.reject();

        return asyncValidate(
          { [NAME_FIELD_NAME]: 'unableToCheck', [TYPE_FIELD_NAME]: 'validType' },
          dispatch,
          componentProps,
          NAME_FIELD_NAME,
        )
          .then(() => expect(true).toBe(false)) // fail test if no error thrown
          .catch(error => expect(error).toEqual({ name: 'Unable to check if Notebook URL Name is unique.' }));
      });

      it('should return a rejected promise for async errors', () => {
        const values = { [NAME_FIELD_NAME]: 'invalidName' };
        const dispatch = () => Promise.resolve({ value: false });

        return asyncValidate(values, dispatch, componentProps, NAME_FIELD_NAME)
          .then(() => expect(true).toBe(false)) // fail test if no error thrown
          .catch(error => expect(error).toEqual({ name: 'Another resource is already using this name and names must be unique.' }));
      });
    });

    describe('validate type', () => {
      const notebookInfo = {
        JUPYTER: { displayName: 'Jupyter' },
        RSTUDIO: { displayName: 'RStudio' },
      };
      getNotebookInfo.mockResolvedValue(notebookInfo);

      it('should return rejected promise for async errors', () => {
        const values = { [TYPE_FIELD_NAME]: 'invalidType' };

        return asyncValidate(values, jest.fn().mockName('dispatch'), {}, TYPE_FIELD_NAME)
          .then(() => expect(true).toBe(false)) // fail test if no error thrown
          .catch(error => expect(error).toEqual({ type: 'Type must be one of JUPYTER,RSTUDIO' }));
      });
    });
  });
});
