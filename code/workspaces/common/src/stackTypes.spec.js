import { getCategoryFromTypeName, stackInCategory, JUPYTER, RSHINY, NFS_VOLUME, ANALYSIS, PUBLISH, DATA_STORE } from './stackTypes';

describe('stackInCategory', () => {
  describe('returns true when stack is of category', () => {
    it('when passed single category', () => {
      expect(stackInCategory(JUPYTER, ANALYSIS)).toBe(true);
      expect(stackInCategory(RSHINY, PUBLISH)).toBe(true);
      expect(stackInCategory(NFS_VOLUME, DATA_STORE)).toBe(true);
    });

    it('when passed multiple categories', () => {
      expect(stackInCategory(JUPYTER, ANALYSIS, PUBLISH)).toBe(true);
      expect(stackInCategory(RSHINY, PUBLISH, DATA_STORE)).toBe(true);
      expect(stackInCategory(NFS_VOLUME, ANALYSIS, PUBLISH, DATA_STORE)).toBe(true);
    });
  });

  describe('returns false when stack is not of category', () => {
    it('when passed a single category', () => {
      expect(stackInCategory(JUPYTER, DATA_STORE)).toBe(false);
      expect(stackInCategory(RSHINY, ANALYSIS)).toBe(false);
      expect(stackInCategory(NFS_VOLUME, PUBLISH)).toBe(false);
    });

    it('when passes multiple categories', () => {
      expect(stackInCategory(JUPYTER, DATA_STORE, PUBLISH)).toBe(false);
      expect(stackInCategory(RSHINY, ANALYSIS, DATA_STORE)).toBe(false);
      expect(stackInCategory(NFS_VOLUME, ANALYSIS, PUBLISH)).toBe(false);
    });
  });
});

describe('getCategoryFromTypeName', () => {
  it('returns category for an existing type', () => {
    expect(getCategoryFromTypeName(JUPYTER)).toBe(ANALYSIS);
    expect(getCategoryFromTypeName(RSHINY)).toBe(PUBLISH);
  });

  it('returns null for an unrecognized type', () => {
    expect(getCategoryFromTypeName('no-such-type')).toBe(null);
  });
});
