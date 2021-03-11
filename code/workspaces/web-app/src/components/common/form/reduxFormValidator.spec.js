import reduxFormValidator from './reduxFormValidator';

describe('reduxFormValidator', () => {
  it('validates inputs and returns errors in form suitable for redux form', () => {
    const values = { name: null };
    const constraints = { name: { presence: true } };

    const validationResult = reduxFormValidator(values, constraints);

    // redux form requires errors to be in form { fieldName: error }
    expect(validationResult).toEqual({ name: "Name can't be blank" });
  });
});
