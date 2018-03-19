function filterByUser(user) {
  const { sub } = user;
  return this.find({ users: { $elemMatch: { $eq: sub } } });
}

export function filterOneByUser(user) {
  const { sub } = user;
  return this.findOne({ users: { $elemMatch: { $eq: sub } } });
}

export default filterByUser;
