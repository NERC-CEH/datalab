export const mockResolvers = {
  Query: {
    userPermissions: () => ['project:stacks:list', 'project:storage:list', 'project:permissions:read',
      'project:storage:create', 'project:storage:open', 'project:storage:delete', 'project:storage:edit'],
  },
};

export const mockTypes = {
  String: () => 'Hello',
  DataStore: () => ({
    users: () => ['auth0|595f40a25caf4344b2e0e678'],
    status: () => 'ready',
  }),
};

