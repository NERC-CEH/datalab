class InvocationState {
  constructor() {
    this.queries = [];
    this.lastQuery = undefined;
    this.entity = undefined;
    this.projectKey = undefined;
    this.params = undefined;
    this.user = undefined;
  }

  addQuery(query) {
    this.lastQuery = query;
    this.queries.push(query);
  }
}

function createDatabaseMock(items, state) {
  let lastInvocation = state || new InvocationState();

  return () => ({
    find: (query) => {
      lastInvocation.addQuery(query);
      return createDatabaseMock(items, lastInvocation)();
    },
    findOne: (query) => {
      lastInvocation.addQuery(query);
      return createDatabaseMock(items[0], lastInvocation)();
    },
    findOneAndUpdate: (query, entity, params) => {
      lastInvocation.addQuery(query);
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
    filterByUserSharedVisible({ sub }) {
      lastInvocation.user = sub;
      return createDatabaseMock(items, lastInvocation)();
    },
    filterOneByUserSharedVisible({ sub }) {
      lastInvocation.user = sub;
      return createDatabaseMock(items, lastInvocation)();
    },
    remove: (query) => {
      lastInvocation.addQuery(query);
      return createDatabaseMock(items, lastInvocation)();
    },
    deleteOne: (query) => {
      lastInvocation.addQuery(query);
      return createDatabaseMock(items, lastInvocation)();
    },
    updateOne: (query) => {
      lastInvocation.addQuery(query);
      return createDatabaseMock(items, lastInvocation)();
    },
    exec: () => Promise.resolve(items),
    invocation: () => lastInvocation,
    query: () => lastInvocation.lastQuery,
    queries: () => lastInvocation.queries,
    entity: () => lastInvocation.entity,
    params: () => lastInvocation.params,
    project: () => lastInvocation.projectKey,
    user: () => lastInvocation.user,
    clear: () => { lastInvocation = new InvocationState(); },
  });
}

export default createDatabaseMock;
