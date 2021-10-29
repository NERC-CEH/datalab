import syncValidate from './addAssetsToNotebookValidator';

const addAssetsForm = {
  project: 'Project Name',
  notebook: 'Notebook Name',
  assets: ['asset1', 'asset2'],
};

describe('syncValidate', () => {
  it('should return no errors for a valid form', () => {
    expect(syncValidate(addAssetsForm)).toBeUndefined();
  });

  it('should return an error when there is no project', () => {
    const invalidForm = { ...addAssetsForm, project: undefined };
    expect(syncValidate(invalidForm)).toEqual({
      project: "Project can't be blank",
    });
  });

  it('should return an error when there is no notebook', () => {
    const invalidForm = { ...addAssetsForm, notebook: undefined };
    expect(syncValidate(invalidForm)).toEqual({
      notebook: "Notebook can't be blank",
    });
  });

  it('should return an error when the assets are empty', () => {
    const invalidForm = { ...addAssetsForm, assets: [] };
    expect(syncValidate(invalidForm)).toEqual({
      assets: "Assets can't be blank",
    });
  });
});

