import { GLUSTERFS_VOLUME, JUPYTER } from 'common/src/stackTypes';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';

const value = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackA' },
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' },
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA' },
];
const payload = [
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB' },
];
const nextValue = [
  // proj1.stackA removed, and not re-added from payload
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' }, // stays because it's a different category
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.stackA' }, // stays because it's a different project
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB' }, // added in from payload, replacing proj1.stackA
];

describe('replaceProjectCategoryItems', () => {
  it('returns nextValue from value and payload', () => {
    expect(replaceProjectCategoryItems(value, payload)).toEqual(nextValue);
  });
});
