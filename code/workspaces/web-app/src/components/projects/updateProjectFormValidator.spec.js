import syncValidate from './updateProjectFormValidator';

const projectForm = {
  name: 'Project Name',
  description: "The project's description",
  collaborationLink: 'some-collaboration-link',
};

describe('syncValidate', () => {
  it('should return no errors for a valid form', () => {
    expect(syncValidate(projectForm)).toBeUndefined();
  });

  it('should return an error when the name is less than 2 chars long', () => {
    const invalidForm = { ...projectForm, name: 'P' };
    expect(syncValidate(invalidForm)).toMatchSnapshot();
  });
});

