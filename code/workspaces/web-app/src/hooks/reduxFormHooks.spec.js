import { useSelector } from 'react-redux';
import reduxFormSelectors from '../selectors/reduxFormSelectors';
import { useReduxFormValue } from './reduxFormHooks';

jest.mock('react-redux');
jest.mock('../selectors/reduxFormSelectors');

const FORM_NAME = 'form';
const FIELD_NAME = 'field';

const mockReduxFormValueSelector = jest.fn().mockName('reduxFormValueSelector');

reduxFormSelectors.reduxFormValue = mockReduxFormValueSelector;

describe('useReduxFormValue', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns the result of useSelector', () => {
    const useSelectorReturnValue = 'return value';
    useSelector.mockReturnValueOnce(useSelectorReturnValue);

    const result = useReduxFormValue(FORM_NAME, FIELD_NAME);
    expect(result).toBe(useSelectorReturnValue);
  });

  it('calls useSelector with the result of the correct selector', () => {
    const selectorReturnValue = 'return value';
    mockReduxFormValueSelector.mockReturnValueOnce(selectorReturnValue);

    useReduxFormValue(FORM_NAME, FIELD_NAME);

    expect(useSelector).toBeCalledWith(selectorReturnValue);
  });

  it('calls useSelector with the correct arguments', () => {
    useReduxFormValue(FORM_NAME, FIELD_NAME);
    expect(mockReduxFormValueSelector).toBeCalledWith(FORM_NAME, FIELD_NAME);
  });
});
