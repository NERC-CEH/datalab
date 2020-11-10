import reduxFormSelectors from './reduxFormSelectors';

describe('selectReduxFormValue', () => {
  const FORM_NAME = 'testForm';
  const FIELD_NAME = 'testField';

  const reduxState = {
    form: {
      [FORM_NAME]: {
        values: {
          [FIELD_NAME]: 'test field value',
        },
      },
    },
  };

  it('returns value of specified field in specified form when it has a value', () => {
    const result = reduxFormSelectors.reduxFormValue(FORM_NAME, FIELD_NAME)(reduxState);
    expect(result).toEqual('test field value');
  });

  it('returns undefined if form with specified name does not exist', () => {
    const result = reduxFormSelectors.reduxFormValue('missing form', FIELD_NAME)(reduxState);
    expect(result).toBeUndefined();
  });

  it('returns undefined if specified field does not have a value in specified form', () => {
    const result = reduxFormSelectors.reduxFormValue(FORM_NAME, 'missing field')(reduxState);
    expect(result).toBeUndefined();
  });
});
