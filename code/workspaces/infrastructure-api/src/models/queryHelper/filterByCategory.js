function filterFind(category) {
  return this.find({ category: { $regex: `^${category}$`, $options: 'i' } });
}

export default { filterFind };
