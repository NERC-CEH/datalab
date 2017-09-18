import validate from './newNotebookFormValidator';

describe('New Notebook Form Validator', () => {
  it('should return empty errors object for valid form', () => {
    const values = {
      displayName: 'Display Name',
      type: 'jupyter',
      name: 'name',
      description: 'The notebook description',
    };

    expect(validate(values)).toBeUndefined();
  });

  it('should return correct errors for empty form', () => {
    const values = {};

    expect(validate(values)).toMatchSnapshot();
  });
});
