import React from 'react';
import { shallow } from 'enzyme';
import { PureEditSiteForm } from './EditSiteForm';

describe('EditSiteForm', () => {
  const shallowRender = () => shallow(
    <PureEditSiteForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
    />,
  );

  it('renders to match snapshot', () => {
    const pristine = true;
    expect(shallowRender(pristine)).toMatchSnapshot();
  });
});
