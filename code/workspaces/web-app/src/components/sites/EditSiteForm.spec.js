import React from 'react';
import { render } from '../../testUtils/renderTests';
import { PureEditSiteForm } from './EditSiteForm';
import { useCurrentProject } from '../../hooks/currentProjectHooks';

jest.mock('../../hooks/currentProjectHooks');
const currentProject = { fetching: false, value: { key: 'projectKey' } };
useCurrentProject.mockReturnValue(currentProject);

jest.mock('../common/form/controls', () => ({
  UpdateFormControls: props => (<>UpdateFormControls Mock {JSON.stringify(props)}</>),
}));
jest.mock('redux-form', () => ({
  ...jest.requireActual('redux-form'),
  Field: props => (<>Field Mock: {JSON.stringify(props)}</>),
}));

describe('EditSiteForm', () => {
  const renderComponent = () => render(
    <PureEditSiteForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
      projectKey="projectKey"
    />,
  );

  it('renders to match snapshot', () => {
    expect(renderComponent().container).toMatchSnapshot();
  });
});
