export default function replaceProjectCategoryItems(value, payload) {
  if (!payload || payload.length === 0) return [...value];
  if (!value || value.length === 0) return [...payload];
  const { projectKey, category } = payload[0];
  return [
    ...value.filter(
      item => item.projectKey !== projectKey || item.category !== category,
    ),
    ...payload];
}
