
function createDatabaseMock(notebooks) {
  return () => ({
    find: () => ({ exec: () => Promise.resolve(notebooks) }),
    findOne: queryObject => ({ exec: () => Promise.resolve(notebooks[0]) }),
  });
}

export default createDatabaseMock;
