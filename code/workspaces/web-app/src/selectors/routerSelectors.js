const selectUrlSearch = ({ router: { location: { search } } }) => search;

export default {
  searchUrl: selectUrlSearch,
};
