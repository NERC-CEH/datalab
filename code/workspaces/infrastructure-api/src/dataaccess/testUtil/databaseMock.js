function createDatabaseMock(items, state = {}) {
  let lastInvocation = state;

  return () => ({
    find: (query) => {
      lastInvocation.query = query;
      return createDatabaseMock(items, lastInvocation)();
    },
    findOne: (query) => {
      lastInvocation.query = query;
      return createDatabaseMock(items[0], lastInvocation)();
    },
    findOneAndUpdate: (query, entity, params) => {
      lastInvocation.query = query;
      lastInvocation.entity = entity;
      lastInvocation.params = params;
      return createDatabaseMock(entity, lastInvocation)();
    },
    filterByProject(projectKey) {
      lastInvocation.projectKey = projectKey;
      return createDatabaseMock(items, lastInvocation)();
    },
    filterOneByProject(projectKey) {
      lastInvocation.projectKey = projectKey;
      return createDatabaseMock(items, lastInvocation)();
    },
    filterByUser({ sub }) {
      lastInvocation.user = sub;
      return createDatabaseMock(items, lastInvocation)();
    },
    filterOneByUser({ sub }) {
      lastInvocation.user = sub;
      return createDatabaseMock(items, lastInvocation)();
    },
    remove: (query) => {
      lastInvocation.query = query;
      return createDatabaseMock(items, lastInvocation)();
    },
    exec: () => Promise.resolve(items),
    invocation: () => lastInvocation,
    query: () => lastInvocation.query,
    entity: () => lastInvocation.entity,
    params: () => lastInvocation.params,
    project: () => lastInvocation.projectKey,
    user: () => lastInvocation.user,
    clear: () => { lastInvocation = {}; },
  });
}

export default createDatabaseMock;
