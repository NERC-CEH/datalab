import { getCategoryFromTypeName, JUPYTER, RSHINY, ANALYSIS, PUBLISH } from './stackTypes';

describe('getCategoryFromTypeName', () => {
  it('returns category for an existing type', () => {
    expect(getCategoryFromTypeName(JUPYTER)).toBe(ANALYSIS);
    expect(getCategoryFromTypeName(RSHINY)).toBe(PUBLISH);
  });

  it('returns null for an unrecognized type', () => {
    expect(getCategoryFromTypeName('no-such-type')).toBe(null);
  });
});
