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
  let invocations = state || new InvocationState();

  return () => ({
    find: (query) => {
      invocations.addQuery(query);
      return createDatabaseMock(items, invocations)();
    },
    findOne: (query) => {
      invocations.addQuery(query);
      return createDatabaseMock(items[0], invocations)();
    },
    findOneAndUpdate: (query, entity, params) => {
      invocations.addQuery(query);
      invocations.entity = entity;
      invocations.params = params;
      return createDatabaseMock(entity, invocations)();
    },
    filterByCategory(category) {
      invocations.category = category;
      return createDatabaseMock(items, invocations)();
    },
    filterByProject(projectKey) {
      invocations.projectKey = projectKey;
      return createDatabaseMock(items, invocations)();
    },
    filterOneByProject(projectKey) {
      invocations.projectKey = projectKey;
      return createDatabaseMock(items, invocations)();
    },
    filterByUser({ sub }) {
      invocations.user = sub;
      return createDatabaseMock(items, invocations)();
    },
    filterOneByUser({ sub }) {
      invocations.user = sub;
      return createDatabaseMock(items, invocations)();
    },
    filterByUserSharedVisible({ sub }) {
      invocations.user = sub;
      return createDatabaseMock(items, invocations)();
    },
    filterOneByUserSharedVisible({ sub }) {
      invocations.user = sub;
      return createDatabaseMock(items, invocations)();
    },
    remove: (query) => {
      invocations.addQuery(query);
      return createDatabaseMock(items, invocations)();
    },
    deleteOne: (query) => {
      invocations.addQuery(query);
      return createDatabaseMock(items, invocations)();
    },
    updateOne: (query) => {
      invocations.addQuery(query);
      return createDatabaseMock(items, invocations)();
    },
    exec: () => Promise.resolve(items),
    invocation: () => invocations,
    query: () => invocations.lastQuery,
    queries: () => invocations.queries,
    entity: () => invocations.entity,
    params: () => invocations.params,
    project: () => invocations.projectKey,
    category: () => invocations.category,
    user: () => invocations.user,
    clear: () => { invocations = new InvocationState(); },
  });
}

export default createDatabaseMock;
