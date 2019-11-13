import { visibility } from '../stackEnums';

const getQuery = (user) => {
  const { sub } = user;
  const { PROJECT, PUBLIC } = visibility;
  const requiredVisibility = { $in: [PROJECT, PUBLIC] };

  return {
    $or: [
      { users: { $elemMatch: { $eq: sub } } },
      { shared: requiredVisibility },
      { visible: requiredVisibility },
    ],
  };
};

// These two have to be declared using 'function' so that 'this' can be
// bound to them
function filterFind(user) {
  return this.find(getQuery(user));
}

function filterFindOne(user) {
  return this.findOne(getQuery(user));
}

export default { filterFind, filterFindOne };
