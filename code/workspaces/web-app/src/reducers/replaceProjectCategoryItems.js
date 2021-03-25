export default function replaceProjectCategoryItems(value, projectKey, category, payloadItems) {
  if (!value || value.length === 0) return [...payloadItems];
  return [
    ...value.filter(
      item => item.projectKey !== projectKey || item.category !== category,
    ),
    ...payloadItems];
}
