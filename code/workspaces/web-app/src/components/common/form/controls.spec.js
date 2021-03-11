import { createHelperText } from './controls';

describe('createHelperText', () => {
  describe('constructs the correct helper text when', () => {
    it('field touched, there is an error and helper text is provided', () => {
      const touched = true;
      const error = 'Expected error';
      const helperText = 'Helper text';

      const result = createHelperText(touched, error, helperText);

      expect(result).toMatchSnapshot();
    });

    it('field touched, there is an error and helperText is not given', () => {
      const touched = true;
      const error = 'Expected error';
      const helperText = undefined;

      const result = createHelperText(touched, error, helperText);

      expect(result).toEqual(error);
    });

    it('field touched, there is no error and helperText is given', () => {
      const touched = true;
      const error = undefined;
      const helperText = 'Helper text';

      const result = createHelperText(touched, error, helperText);

      expect(result).toEqual(helperText);
    });

    it('field touched, there is no error and helper text is not given', () => {
      const touched = true;
      const error = undefined;
      const helperText = undefined;

      const result = createHelperText(touched, error, helperText);

      expect(result).toBeDefined();
    });

    it('field not touched, there is an error and helper text provided', () => {
      const touched = false;
      const error = 'Expected error';
      const helperText = 'Helper text';

      const result = createHelperText(touched, error, helperText);

      expect(result).toEqual(helperText);
    });

    it('field not touched, there is no error and helper text provided', () => {
      const touched = false;
      const error = undefined;
      const helperText = 'Helper text';

      const result = createHelperText(touched, error, helperText);

      expect(result).toEqual(helperText);
    });

    it('field not touched, there is no error and no helper text provided', () => {
      const touched = false;
      const error = undefined;
      const helperText = undefined;

      const result = createHelperText(touched, error, helperText);

      expect(result).toEqual('');
    });
  });
});
