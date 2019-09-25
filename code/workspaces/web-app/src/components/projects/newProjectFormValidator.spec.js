import { syncValidate, asyncValidate } from './newProjectFormValidator';
import projectActions from '../../actions/projectActions';

const projectForm = {
  name: 'Project Name',
  projectKey: 'project',
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

  it('should return an error when the projectKey is less than 2 chars long', () => {
    const invalidForm = { ...projectForm, projectKey: 'p' };
    expect(syncValidate(invalidForm)).toMatchSnapshot();
  });

  it('should return an error when the projectKey is more than 8 chars long', () => {
    const invalidForm = { ...projectForm, projectKey: 'projectone' };
    expect(syncValidate(invalidForm)).toMatchSnapshot();
  });

  describe('should return an error if project key contains', () => {
    it('a space', () => {
      const invalidForm = { ...projectForm, projectKey: 'proj ect' };
      expect(syncValidate(invalidForm)).toMatchSnapshot();
    });

    it('a number', () => {
      const invalidForm = { ...projectForm, projectKey: 'project1' };
      expect(syncValidate(invalidForm)).toMatchSnapshot();
    });

    it('a capital letter', () => {
      const invalidForm = { ...projectForm, projectKey: 'Project' };
      expect(syncValidate(invalidForm)).toMatchSnapshot();
    });

    it('a hyphen', () => {
      const invalidForm = { ...projectForm, projectKey: 'pro-ject' };
      expect(syncValidate(invalidForm)).toMatchSnapshot();
    });
  });
});

describe('asyncValidate', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const dispatch = value => Promise.resolve({ value });

  it('returns nothing if projectKey is unique', async () => {
    projectActions.checkProjectKeyUniqueness = () => true;
    const result = await asyncValidate(projectForm, dispatch);
    expect(result).toBeUndefined();
  });

  it('returns error if projectKey is not unique', async () => {
    projectActions.checkProjectKeyUniqueness = () => false;
    let error;
    try {
      await asyncValidate(projectForm, dispatch);
    } catch (err) {
      error = err;
    }
    expect(error).toMatchSnapshot();
  });

  it('returns error if unable to check projectKey is unique', async () => {
    projectActions.checkProjectKeyUniqueness = jest.fn();
    let error;
    try {
      await asyncValidate(projectForm, () => Promise.reject());
    } catch (err) {
      error = err;
    }
    expect(error).toMatchSnapshot();
  });
});
