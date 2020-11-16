const allFiltersOff = filters => !Object.values(filters).reduce((anyTrue, filter) => anyTrue || filter);

export default allFiltersOff;
