import etcdService from '../services/etcd.service.instance';
import startEtcdBackend from './etcd-backend';

jest.mock('../services/etcd.service');

const mockGetOrCreate = jest.fn();
const mockCreateWatcher = jest.fn();

etcdService.getOrCreateDirectory = mockGetOrCreate;
etcdService.createWatcher = mockCreateWatcher;

beforeEach(() => {
  jest.resetAllMocks();
});

afterEach(() => {
  jest.resetAllMocks();
});

test('test start registers routes', (done) => {
  const mockRegister = jest.fn();
  const mockOn = jest.fn().mockImplementation(() => {
    // console.log('On Mock called')
  });

  const proxy = { register: mockRegister };

  const watcher = { on: mockOn };

  const routes = [
    { key: 'redbird/key1', value: 'value1' },
    { key: 'redbird/key2', value: 'value2' },
  ];

  mockGetOrCreate.mockReturnValueOnce(Promise.resolve(routes));
  mockCreateWatcher.mockReturnValueOnce(watcher);

  startEtcdBackend(proxy).then(() => {
    expect(mockOn).toHaveBeenCalledTimes(3);
    expect(mockRegister).toHaveBeenCalledWith('key1', 'value1', { ssl: true });
    expect(mockRegister).toHaveBeenCalledWith('key2', 'value2', { ssl: true });
    done();
  });
});
