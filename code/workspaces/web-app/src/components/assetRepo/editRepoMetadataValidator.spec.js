import { syncValidate } from './editRepoMetadataValidator';

const values = {
  owners: [{ userId: 'user-123' }],
  visible: 'Visible',
};

describe('syncValidate', () => {
  it('should return no errors for valid values', () => {
    expect(syncValidate(values)).toBeUndefined();
  });

  it('should return an error when owners is missing', () => {
    const invalidValues = { ...values, owners: undefined };
    expect(syncValidate(invalidValues)).toEqual({ owners: "Owners can't be blank" });
  });

  it('should return an error when owners is empty', () => {
    const invalidValues = { ...values, owners: [] };
    expect(syncValidate(invalidValues)).toEqual({ owners: "Owners can't be blank" });
  });

  it('should return an error when visible is missing', () => {
    const invalidValues = { ...values, visible: undefined };
    expect(syncValidate(invalidValues)).toEqual({ visible: "Visible can't be blank" });
  });
});

