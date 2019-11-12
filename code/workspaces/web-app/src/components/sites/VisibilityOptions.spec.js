import { createShallow } from '@material-ui/core/test-utils';
import visibilityOptions from './VisibilityOptions';

describe('SiteSharingOptions-personal', () => {
  function shallowRender() {
    const shallow = createShallow();
    return shallow(visibilityOptions[0].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

describe('SiteSharingOptions-project', () => {
  function shallowRender() {
    const shallow = createShallow();
    return shallow(visibilityOptions[1].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});

describe('SiteSharingOptions-project', () => {
  function shallowRender() {
    const shallow = createShallow();
    return shallow(visibilityOptions[2].text);
  }

  it('correctly renders correct snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
