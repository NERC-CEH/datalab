import { getEnumValues } from './stackEnums';

describe('getEnumValue', () => {
  it('returns values of the enum object passed to it', () => {
    const testEnum = Object.freeze({
      TEST_ONE: 'test-one',
      TEST_TWO: 'TEST_TWO',
    });
    const expectedValues = ['test-one', 'TEST_TWO'];

    expect(getEnumValues(testEnum)).toEqual(expectedValues);
  });
});
