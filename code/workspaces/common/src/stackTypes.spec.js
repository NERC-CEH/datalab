import { JUPYTER, basePath } from './stackTypes';

describe('stackTypes', () => {
  describe('basePath', () => {
    const projectKey = 'project-key';
    const name = 'name';
    it('gives custom base path if type is for single hostname', () => {
      expect(basePath(JUPYTER, projectKey, name)).toEqual('/resource/project-key/name');
    });

    it('gives root base path if type is for multiple hostname', () => {
      expect(basePath('assumed-to-be-multiple', projectKey, name)).toEqual('/');
    });
  });
});
