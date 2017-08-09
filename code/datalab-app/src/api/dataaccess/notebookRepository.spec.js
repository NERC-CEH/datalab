import notebookRepository from './notebookRepository';

describe('notebookRepository', () => {
  it('getAll returns expected snapshot', () => {
    expect(notebookRepository.getAll('user')).toMatchSnapshot();
  });

  it('getById returns expected snapshot', () => {
    expect(notebookRepository.getById(1)).toMatchSnapshot();
  });
});
