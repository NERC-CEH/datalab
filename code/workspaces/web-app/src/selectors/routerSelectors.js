const selectUrlSearch = ({ router: { location: { search } } }) => search;

const routerSelectors = {
  searchUrl: selectUrlSearch,
};
export default routerSelectors;
