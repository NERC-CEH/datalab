const selectSearchHash = ({ router: { location: { search } } }) => search;

export default {
  searchHash: selectSearchHash,
};
