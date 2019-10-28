const selectUrlHash = ({ router: { location: { hash } } }) => hash;

export default {
  urlHash: selectUrlHash,
};
