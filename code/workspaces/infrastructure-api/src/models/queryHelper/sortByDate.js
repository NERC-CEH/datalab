function sortByCreated(order) {
  return this.sort({ created: order });
}

function sortByExpiry(order) {
  return this.sort({ expiry: order });
}

export default { sortByCreated, sortByExpiry };
