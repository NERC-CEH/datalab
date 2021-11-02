import syncValidate from './addAssetsToNotebookValidator';

const addAssetsForm = {
  project: 'Project',
  notebook: 'Notebook',
  assets: ['asset1', 'asset2'],
};

const props = {
  projectOptions: [{ value: 'Project', text: 'Project' }],
  notebookOptions: [{ value: 'Notebook', text: 'Notebook' }],
};

describe('syncValidate', () => {
  it('should return no errors for a valid form', () => {
    expect(syncValidate(addAssetsForm, props)).toBeUndefined();
  });

  it('should return an error when there is no project', () => {
    const invalidForm = { ...addAssetsForm, project: undefined };
    expect(syncValidate(invalidForm, props)).toEqual({
      project: "Project can't be blank",
    });
  });

  it('should return an error when there is no notebook', () => {
    const invalidForm = { ...addAssetsForm, notebook: undefined };
    expect(syncValidate(invalidForm, props)).toEqual({
      notebook: "Notebook can't be blank",
    });
  });

  it('should return an error when the assets are empty', () => {
    const invalidForm = { ...addAssetsForm, assets: [] };
    expect(syncValidate(invalidForm, props)).toEqual({
      assets: "Assets can't be blank",
    });
  });

  it('should return an error when the project is not in the allowed list', () => {
    const invalidForm = { ...addAssetsForm, project: 'Disallowed' };
    expect(syncValidate(invalidForm, props)).toEqual({
      project: 'Disallowed is not included in the list',
    });
  });

  it('should return an error when the notebook is not in the allowed list', () => {
    const invalidForm = { ...addAssetsForm, notebook: 'Disallowed' };
    expect(syncValidate(invalidForm, props)).toEqual({
      notebook: 'Disallowed is not included in the list',
    });
  });
});

