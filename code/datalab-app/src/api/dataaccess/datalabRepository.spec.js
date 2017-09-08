import datalabRepository from './datalabRepository';
import database from '../config/database';
import databaseMock from './testUtil/databaseMock';

jest.mock('../config/database');

const testDatalabds = [
  { name: 'testlab' },
  { name: 'datalab' },
];
const mockDatabase = databaseMock(testDatalabds);
database.getModel = mockDatabase;

describe('datalabRepository', () => {
  beforeEach(() => {
    mockDatabase().clear();
  });

  it('getAll returns expected snapshot', () =>
    datalabRepository.getAll('user').then((datalabs) => {
      expect(mockDatabase().query()).toEqual({});
      expect(datalabs).toMatchSnapshot();
    }));

  it('getByName returns expected snapshot', () =>
    datalabRepository.getByName(undefined, 'datalab').then((datalabs) => {
      expect(mockDatabase().query()).toEqual({ name: 'datalab' });
      expect(datalabs).toMatchSnapshot();
    }));
});
