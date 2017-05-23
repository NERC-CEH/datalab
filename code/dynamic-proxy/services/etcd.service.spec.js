import Service from './etcd.service';

jest.mock('bunyan', () => ({
  createLogger: () => ({
    info: () => {},
  }),
}));

const mockGet = jest.fn();
const mockSet = jest.fn();
const mockDel = jest.fn();
const mockMkdir = jest.fn();
const mockWatcher = jest.fn();
const service = new Service({
  getAsync: mockGet,
  setAsync: mockSet,
  delAsync: mockDel,
  mkdirAsync: mockMkdir,
  watcher: mockWatcher,
});

beforeEach(() => {
  jest.resetAllMocks();
});

test('get routes returns an empty array when directory is empty', (done) => {
  mockGet.mockReturnValue(Promise.resolve({}));

  return service.getRoutes().then((data) => {
    expect(data).toEqual([]);
    done();
  });
});

test('get routes maps an etcd response to simple route objects', (done) => {
  mockGet.mockReturnValue(Promise.resolve(createEtcdResponse()));

  return service.getRoutes().then((data) => {
    expect(data).toEqual([
      {
        key: '/redbird/test.route.ac.uk',
        value: 'http://localhost:7001',
      },
      {
        key: '/redbird/another.route.ac.uk',
        value: 'http://localhost:7002',
      },
    ]);
    done();
  });
});

test('add route sets correct key', (done) => {
  const source = 'test.route.ac.uk';
  const target = 'http://localhost:8000';

  const etcdResponse = { message: 'Etcd Response' };
  mockSet.mockReturnValue(Promise.resolve(etcdResponse));
  return service.addRoute(source, target)
    .then((data) => {
      expect(mockSet).toBeCalledWith(`redbird/${source}`, target);
      expect(data).toEqual(etcdResponse);
      done();
    });
});

test('add route converts sub paths to -', (done) => {
  const source = 'test.route.ac.uk/api';
  const target = 'http://localhost:8000';

  const etcdResponse = { message: 'Etcd Response' };
  mockSet.mockReturnValue(Promise.resolve(etcdResponse));
  return service.addRoute(source, target)
    .then((data) => {
      expect(mockSet).toBeCalledWith('redbird/test.route.ac.uk-api', target);
      expect(data).toEqual(etcdResponse);
      done();
    });
});

test('delete route deletes correct key', (done) => {
  const source = 'test.route.ac.uk';

  const etcdResponse = { message: 'Etcd Response' };
  mockDel.mockReturnValue(Promise.resolve(etcdResponse));
  return service.deleteRoute(source)
    .then((data) => {
      expect(mockDel).toBeCalledWith('redbird/test.route.ac.uk');
      expect(data).toEqual(etcdResponse);
      done();
    });
});

test('delete all routes deletes directory and recreates', (done) => {
  const etcdResponse = { message: 'Etcd Response' };
  mockDel.mockReturnValueOnce(Promise.resolve(etcdResponse));
  mockMkdir.mockReturnValueOnce(Promise.resolve(etcdResponse));
  return service.deleteAllRoutes()
    .then((data) => {
      expect(mockDel).toBeCalledWith('/redbird/', { recursive: true });
      expect(mockMkdir).toBeCalledWith('redbird');
      expect(data).toEqual(etcdResponse);
      done();
    });
});

test('get or create directory creates directory if it does not exist', (done) => {
  const etcdResponse = { message: 'Etcd Response' };
  mockGet.mockReturnValueOnce(Promise.reject());
  mockMkdir.mockReturnValueOnce(Promise.resolve(etcdResponse));
  return service.getOrCreateDirectory()
    .then((data) => {
      expect(mockGet).toBeCalledWith('redbird');
      expect(mockMkdir).toBeCalledWith('redbird');
      expect(data).toEqual([]);
      done();
    });
});

test('get or create directory returns routes if directory exists', (done) => {
  mockGet.mockReturnValueOnce(Promise.resolve(createEtcdResponse()));
  return service.getOrCreateDirectory()
    .then((data) => {
      expect(mockGet).toBeCalledWith('redbird');
      expect(mockMkdir).not.toHaveBeenCalled();
      expect(data.length).toEqual(2);
      done();
    });
});

test('create watcher correctly builds watcher', () => {
  const returnedWatcher = {};
  mockWatcher.mockReturnValueOnce(returnedWatcher);

  const watcher = service.createWatcher();

  expect(mockWatcher).toBeCalledWith('redbird', null, { recursive: true });
  expect(returnedWatcher).toBe(watcher);
});

function createEtcdResponse() {
  return {
    action: 'get',
    node: {
      key: '/redbird',
      dir: true,
      nodes: [
        {
          key: '/redbird/test.route.ac.uk',
          value: 'http://localhost:7001',
          modifiedIndex: 24,
          createdIndex: 24,
        },
        {
          key: '/redbird/another.route.ac.uk',
          value: 'http://localhost:7002',
          modifiedIndex: 24,
          createdIndex: 24,
        },
      ],
      modifiedIndex: 23,
      createdIndex: 23,
    },
  };
}
