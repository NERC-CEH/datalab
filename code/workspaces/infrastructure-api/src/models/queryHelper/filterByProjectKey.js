function filterFind(projectKey) {
  return this.find({ projectKey: { $eq: projectKey } });
}

function filterFindOne(projectKey) {
  return this.findOne({ projectKey: { $eq: projectKey } });
}

export default { filterFind, filterFindOne };
