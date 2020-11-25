import allFiltersOff from './allFiltersOff';

describe('allFiltersOff', () => {
  it('returns true if all filters are off', () => {
    // Arrange
    const filters = { filter1: false, filter2: false };

    // Act/Assert
    expect(allFiltersOff(filters)).toEqual(true);
  });

  it('returns false if any filters are on', () => {
    // Arrange
    const filters = { filter1: false, filter2: true };

    // Act/Assert
    expect(allFiltersOff(filters)).toEqual(false);
  });
});
