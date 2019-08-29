function getProjectById(id) {
  return Promise.resolve({
    id,
    name: 'Project Name',
  });
}

function addProjectPermission(projectId, userId, role) {
  return Promise.resolve({
    projectId,
    role,
  });
}

function removeProjectPermission(projectId, userId, role) {
  return Promise.resolve({
    projectId,
    role,
  });
}

export default { getProjectById, addProjectPermission, removeProjectPermission };
