function filterByUser(user) {
  const { sub } = user;
  return this.find({ users: { $elemMatch: { $eq: sub } } });
}

export default filterByUser;
