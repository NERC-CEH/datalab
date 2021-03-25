import { JUPYTER, NBVIEWER } from 'common/src/stackTypes';
import { NOTEBOOK_CATEGORY, SITE_CATEGORY } from 'common/src/config/images';
import replaceProjectCategoryItems from './replaceProjectCategoryItems';

const GLUSTERFS_VOLUME = 'glusterfs';

const value = [
  { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' },
  { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.notebookA', category: NOTEBOOK_CATEGORY },
  { projectKey: 'proj1', type: NBVIEWER, store: 'proj1.siteA', category: SITE_CATEGORY },
  { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.notebookA', category: NOTEBOOK_CATEGORY },
];

describe('replaceProjectCategoryItems', () => {
  it('replaces value\'s project category items with those from payloadItems', () => {
    const payloadItems = [
      { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB', category: NOTEBOOK_CATEGORY },
    ];
    const nextValue = [
      // proj1.notebookA removed, and not re-added from payload
      { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' }, // stays because it's a different category
      { projectKey: 'proj1', type: NBVIEWER, store: 'proj1.siteA', category: SITE_CATEGORY }, // stays because it's a different category
      { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.notebookA', category: NOTEBOOK_CATEGORY }, // stays because it's a different project
      { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.stackB', category: NOTEBOOK_CATEGORY }, // added in from payload, replacing proj1.notebookA
    ];
    expect(replaceProjectCategoryItems(value, 'proj1', NOTEBOOK_CATEGORY, payloadItems)).toEqual(nextValue);
  });

  it('removes all project category items if none in payloadItems', () => {
    const payloadItems = [
    ];
    const nextValue = [
      // proj1.notebookA removed, and not re-added from payload
      { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeA' }, // stays because it's a different category
      { projectKey: 'proj1', type: NBVIEWER, store: 'proj1.siteA', category: SITE_CATEGORY }, // stays because it's a different category
      { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.notebookA', category: NOTEBOOK_CATEGORY }, // stays because it's a different project
    ];
    expect(replaceProjectCategoryItems(value, 'proj1', NOTEBOOK_CATEGORY, payloadItems)).toEqual(nextValue);
  });

  it('handles items with no category', () => {
    const payloadItems = [
      { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeB' },
    ];
    const nextValue = [
      // proj1.storeA removed, and not re-added from payload
      { projectKey: 'proj1', type: JUPYTER, stack: 'proj1.notebookA', category: NOTEBOOK_CATEGORY },
      { projectKey: 'proj1', type: NBVIEWER, store: 'proj1.siteA', category: SITE_CATEGORY }, // stays because it's a different category
      { projectKey: 'proj2', type: JUPYTER, stack: 'proj2.notebookA', category: NOTEBOOK_CATEGORY }, // stays because it's a different project
      { projectKey: 'proj1', type: GLUSTERFS_VOLUME, store: 'proj1.storeB' }, // added in from payload, replacing proj1.storeA
    ];
    expect(replaceProjectCategoryItems(value, 'proj1', undefined, payloadItems)).toEqual(nextValue);
  });
});
