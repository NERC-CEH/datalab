const cloneUser = user => ({
  ...user,
  projectRoles: [...user.projectRoles],
});

const wrapUser = user => ({
  ...user,
  toObject: () => user,
});

function createDatabaseMock(users) {
  const documents = users.map(cloneUser).map(wrapUser);
  let lastInvocation;
  let findOneReturn;

  return () => ({
    find: (query) => {
      lastInvocation = { query };
      return { exec: () => Promise.resolve(documents) };
    },
    findOne: (query) => {
      lastInvocation = { query };
      return { exec: () => Promise.resolve(findOneReturn) };
    },
    findOneAndUpdate: (query, entity, params) => {
      lastInvocation = { query, entity, params };
      return Promise.resolve(entity);
    },
    remove: (query) => {
      lastInvocation = { query };
      return { exec: () => Promise.resolve() };
    },
    exists: (query) => {
      lastInvocation = { query };
      return Promise.resolve(documents.length > 0);
    },
    create: (entity) => {
      const document = wrapUser(cloneUser(entity));
      lastInvocation = { entity };
      return Promise.resolve(document);
    },
    invocation: () => lastInvocation,
    query: () => lastInvocation.query,
    entity: () => lastInvocation.entity,
    params: () => lastInvocation.params,
    setFindOneReturn: (user) => { findOneReturn = user ? wrapUser(cloneUser(user)) : undefined; },
    clear: () => { lastInvocation = undefined; },
  });
}

export default createDatabaseMock;
