import dataStorageSelectors from './dataStorageSelectors';

const state = {
  dataStorage: [{ name: 'name' }],
};

describe('dataStorage', () => {
  it('returns value of dataStorage from state', () => {
    const dataStorage = dataStorageSelectors.dataStorageArray(state);
    expect(dataStorage).toEqual(state.dataStorage);
    expect(dataStorage).not.toBeUndefined();
  });
});
