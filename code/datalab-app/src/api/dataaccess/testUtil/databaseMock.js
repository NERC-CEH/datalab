
function createDatabaseMock(items) {
  let lastQuery;
  return () => ({
    find: (query) => {
      lastQuery = query;
      return { exec: () => Promise.resolve(items) };
    },
    findOne: (query) => {
      lastQuery = query;
      return { exec: () => Promise.resolve(items[0]) };
    },
    query: () => lastQuery,
    clearQuery: () => { lastQuery = undefined; return undefined; },
  });
}

export default createDatabaseMock;
