import dataStorageRepository from './dataStorageRepository';

describe('dataStorageRepository', () => {
  it('getAll returns expected snapshot', () => {
    expect(dataStorageRepository.getAll()).toMatchSnapshot();
  });

  it('getById returns epexted snapshot', () => {
    expect(dataStorageRepository.getById(1)).toMatchSnapshot();
  });
});
