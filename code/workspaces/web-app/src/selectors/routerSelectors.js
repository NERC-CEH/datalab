const selectUrlHash = ({ router: { location: { search } } }) => search;

export default {
  urlHash: selectUrlHash,
};
