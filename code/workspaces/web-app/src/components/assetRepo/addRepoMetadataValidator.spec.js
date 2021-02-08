import addRepoMetadataValidator from './addRepoMetadataValidator';

const values = {
  name: 'Name',
  version: 'Version',
  type: 'Type',
  fileLocation: '/file/path',
  masterUrl: 'http://master.url',
  owners: [{ userId: 'user-123' }],
  visible: 'Visible',
};

describe('addRepoMetadataValidator', () => {
  it('should return no errors for valid values', () => {
    expect(addRepoMetadataValidator(values)).toBeUndefined();
  });

  it('should return an error when the name is missing', () => {
    const invalidValues = { ...values, name: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ name: "Name can't be blank" });
  });

  it('should return an error when the name is short', () => {
    const invalidValues = { ...values, name: 'sml' };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ name: 'Name is too short (minimum is 4 characters)' });
  });

  it('should return an error when the version is missing', () => {
    const invalidValues = { ...values, version: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ version: "Version can't be blank" });
  });

  it('should return an error when the type is missing', () => {
    const invalidValues = { ...values, type: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ type: "Type can't be blank" });
  });

  it('should return an error if the file path is not a valid linux path', () => {
    const invalidValues = { ...values, fileLocation: 'C://' };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ fileLocation: 'File location is invalid - it must start with a leading slash, trailing slash optional' });
  });

  it('should return an error if the masterUrl is not a valid url', () => {
    const invalidValues = { ...values, masterUrl: '/master/url' };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ masterUrl: 'Master url is not a valid url' });
  });

  it('should return an error when owners is missing', () => {
    const invalidValues = { ...values, owners: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ owners: "Owners can't be blank" });
  });

  it('should return an error when owners is empty', () => {
    const invalidValues = { ...values, owners: [] };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ owners: "Owners can't be blank" });
  });

  it('should return an error when visible is missing', () => {
    const invalidValues = { ...values, visible: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({ visible: "Visible can't be blank" });
  });

  it('should return an error when both masterUrl and fileLocation are missing', () => {
    const invalidValues = { ...values, masterUrl: undefined, fileLocation: undefined };
    expect(addRepoMetadataValidator(invalidValues)).toEqual({
      fileLocation: 'Must be specified if Master URL is blank',
      masterUrl: 'Must be specified if File location is blank',
    });
  });
});

