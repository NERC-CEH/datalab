import React from 'react';
import { shallow } from 'enzyme';
import { PureEditSiteForm } from './EditSiteForm';
import { useCurrentProject } from '../../hooks/currentProjectHooks';

jest.mock('../../hooks/currentProjectHooks');
const currentProject = { fetching: false, value: { key: 'projectKey' } };
useCurrentProject.mockReturnValue(currentProject);

describe('EditSiteForm', () => {
  const shallowRender = () => shallow(
    <PureEditSiteForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
      projectKey="projectKey"
    />,
  );

  it('renders to match snapshot', () => {
    const pristine = true;
    expect(shallowRender(pristine)).toMatchSnapshot();
  });
});
