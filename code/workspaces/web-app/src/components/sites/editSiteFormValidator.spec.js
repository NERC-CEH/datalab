import { syncValidate } from './editSiteFormValidator';

describe('editSiteFormValidator', () => {
  describe('syncValidate', () => {
    it('should return empty errors object for valid form', () => {
      const values = {
        displayName: 'Display Name',
        type: 'jupyter',
      };

      expect(syncValidate(values)).toBeUndefined();
    });

    it('should return correct errors for empty form', () => {
      const values = {};
      expect(syncValidate(values)).toMatchSnapshot();
    });
  });
});
