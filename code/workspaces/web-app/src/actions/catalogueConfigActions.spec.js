import { catalogueConfig } from '../config/catalogue';
import catalogueConfigActions from './catalogueConfigActions';

jest.mock('../config/catalogue');

describe('loadCatalogConfig', () => {
  it('created action matches snapshot', () => {
    catalogueConfig.mockReturnValueOnce('expected catalogue config value');
    expect(catalogueConfigActions.loadCatalogueConfig()).toMatchSnapshot();
  });
});
