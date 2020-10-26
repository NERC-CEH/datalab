const sortByName = (array) => {
  const newArray = [...array];
  newArray.sort((a, b) => a.name.localeCompare(b.name));
  return newArray;
};

export default sortByName;
