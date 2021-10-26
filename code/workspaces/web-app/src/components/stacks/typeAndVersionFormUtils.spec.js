import { change } from 'redux-form';
import data from 'common/src/config/image_config.json';
import { getTypeOptions, getVersionOptions, updateVersionOnTypeChange } from './typeAndVersionFormUtils';

jest.mock('redux-form');

const mockChangeActionType = 'MOCK_REDUX_FORM_CHANGE_ACTION';

beforeEach(() => {
  change.mockImplementation((formName, fieldName, fieldValue) => ({
    type: mockChangeActionType,
    formName,
    fieldName,
    fieldValue,
  }));
});

describe('getTypeOptions', () => {
  it('returns array of values from image options that contain text and value fields suitable for form drop-downs', () => {
    const result = getTypeOptions(data.types);
    expect(result).toMatchSnapshot();
  });
});

describe('getVersionOptions', () => {
  it('returns array of values from image options that text and value fields suitable for form drop-downs with default having additionalText and default field', () => {
    const result = getVersionOptions(data.types, 'rstudio');
    expect(result).toMatchSnapshot();
  });
});

describe('updateVersionOnTypeChange', () => {
  const FORM_NAME = 'testForm';
  const TYPE_FIELD_NAME = 'type';
  const VERSION_FIELD_NAME = 'version';

  const dispatchMock = jest.fn().mockName('dispatch');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('dispatches change action to update the specified version field for specified form when specified type field changes', () => {
    const previousValues = { [TYPE_FIELD_NAME]: 'PREVIOUS_TYPE' };
    const values = { [TYPE_FIELD_NAME]: 'NEW_TYPE' }; // type has changed to trigger action

    it('with default value when versions available ', () => {
      const versionOptions = [
        { text: 'Test Version', value: 'TEST_VERSION' },
        { text: 'Default Version', value: 'DEFAULT_VERSION', default: true },
      ];

      const callBackFn = updateVersionOnTypeChange(FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME, versionOptions);
      callBackFn(values, dispatchMock, {}, previousValues);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: mockChangeActionType,
        formName: FORM_NAME,
        fieldName: VERSION_FIELD_NAME,
        fieldValue: 'DEFAULT_VERSION',
      });
    });

    it('with empty string when when no versions available ', () => {
      const versionOptions = [];

      const callBackFn = updateVersionOnTypeChange(FORM_NAME, TYPE_FIELD_NAME, VERSION_FIELD_NAME, versionOptions);
      callBackFn(values, dispatchMock, {}, previousValues);

      expect(dispatchMock).toHaveBeenCalledWith({
        type: mockChangeActionType,
        formName: FORM_NAME,
        fieldName: VERSION_FIELD_NAME,
        fieldValue: '',
      });
    });
  });
});
