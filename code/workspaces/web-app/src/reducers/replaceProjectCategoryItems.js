import { getCategoryFromTypeName } from 'common/src/stackTypes';

export default function replaceProjectCategoryItems(value, payload) {
  if (!payload || payload.length === 0) return [...value];
  if (!value || value.length === 0) return [...payload];
  const { projectKey, type } = payload[0];
  const category = getCategoryFromTypeName(type);
  return [
    ...value.filter(
      item => item.projectKey !== projectKey || getCategoryFromTypeName(item.type) !== category,
    ),
    ...payload];
}
