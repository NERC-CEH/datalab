import { render } from '../../testUtils/renderTests';
import { notebookSharingOptions, siteVisibilityOptions } from './selectShareOptions';

describe('NotebookSharingOptions-private', () => {
  it('correctly renders correct snapshot', () => {
    expect(render(notebookSharingOptions[0].text).container).toMatchSnapshot();
  });
});

describe('NotebookSharingOptions-project', () => {
  it('correctly renders correct snapshot', () => {
    expect(render(notebookSharingOptions[1].text).container).toMatchSnapshot();
  });
});

describe('SiteVisibilityOptions-private', () => {
  it('correctly renders correct snapshot', () => {
    expect(render(siteVisibilityOptions[0].text).container).toMatchSnapshot();
  });
});

describe('SiteVisibilityOptions-project', () => {
  it('correctly renders correct snapshot', () => {
    expect(render(siteVisibilityOptions[1].text).container).toMatchSnapshot();
  });
});

describe('SiteVisibilityOptions-public', () => {
  it('correctly renders correct snapshot', () => {
    expect(render(siteVisibilityOptions[2].text).container).toMatchSnapshot();
  });
});
