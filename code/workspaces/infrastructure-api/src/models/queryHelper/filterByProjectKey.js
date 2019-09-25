function filterFind(projectKey) {
  return this.find({ projectKey: { $eq: projectKey } });
}

export default { filterFind };
