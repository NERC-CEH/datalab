function handleId(mongooseObj) {
  if (mongooseObj === null) {
    return null;
  }

  const nameKeys = { _id: 'id' }; // eslint-disable-line no-underscore-dangle
  const doc = mongooseObj._doc; // eslint-disable-line no-underscore-dangle

  return Object.entries(doc)
    .reduce((previous, [key, value]) => {
      const keyName = nameKeys[key] || key;

      return Object.assign({}, previous, { [keyName]: value });
    }, {});
}

export const mapHandleId = arrayOfMongooseObj =>
  arrayOfMongooseObj.map(handleId);

export default handleId;
