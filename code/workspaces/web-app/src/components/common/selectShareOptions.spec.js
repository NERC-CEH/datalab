import { createShallow } from '@material-ui/core/test-utils';
import { notebookSharingOptions, siteVisibilityOptions } from './selectShareOptions';

describe('NotebookSharingOptions-private', () => {
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

describe('SiteVisibilityOptions-private', () => {
  function shallowRender() {
    const shallow = createShallow();

    return shallow(siteVisibilityOptions[0].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

describe('SiteVisibilityOptions-project', () => {
  function shallowRender() {
    const shallow = createShallow();

    return shallow(siteVisibilityOptions[1].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

describe('SiteVisibilityOptions-public', () => {
  function shallowRender() {
    const shallow = createShallow();

    return shallow(siteVisibilityOptions[2].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
