import { JUPYTER } from 'common/src/stackTypes';
import { NOTEBOOK_CATEGORY } from 'common/src/config/images';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';

const GLUSTERFS_VOLUME = 'glusterfs';

const value = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackA', category: NOTEBOOK_CATEGORY },
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA', category: 'INFRASTRUCTURE' },
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA', category: NOTEBOOK_CATEGORY },
];
const payload = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB', category: NOTEBOOK_CATEGORY },
];
const nextValue = [
  // proj1.stackA removed, and not re-added from payload
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA', category: 'INFRASTRUCTURE' }, // stays because it's a different category
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA', category: NOTEBOOK_CATEGORY }, // stays because it's a different project
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB', category: NOTEBOOK_CATEGORY }, // added in from payload, replacing proj1.stackA
];

describe('replaceProjectCategoryItems', () => {
  it('returns nextValue from value and payload', () => {
    expect(replaceProjectCategoryItems(value, payload)).toEqual(nextValue);
  });
});
