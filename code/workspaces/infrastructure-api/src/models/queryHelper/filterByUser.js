function filterFind(user) {
  const { sub } = user;
  return this.find({ users: { $elemMatch: { $eq: sub } } });
}

function filterFindOne(user) {
  const { sub } = user;
  return this.findOne({ users: { $elemMatch: { $eq: sub } } });
}

export default { filterFind, filterFindOne };
