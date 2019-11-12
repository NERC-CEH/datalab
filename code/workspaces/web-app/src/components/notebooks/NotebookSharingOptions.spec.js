import { createShallow } from '@material-ui/core/test-utils';
import notebookSharingOptions from './NotebookSharingOptions';

describe('NotebookSharingOptions-personal', () => {
  function shallowRender() {
    const shallow = createShallow();

    return shallow(notebookSharingOptions[0].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

describe('NotebookSharingOptions-project', () => {
  function shallowRender() {
    const shallow = createShallow();

    return shallow(notebookSharingOptions[1].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
