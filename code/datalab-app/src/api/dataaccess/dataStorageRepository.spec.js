import dataStorageRepository from './dataStorageRepository';

describe('dataStorageRepository', () => {
  it('getAll returns expected snapshot', () => {
    expect(dataStorageRepository.getAll('user')).toMatchSnapshot();
  });

  it('getById returns epexted snapshot', () => {
    expect(dataStorageRepository.getById('user', 1)).toMatchSnapshot();
  });
});
