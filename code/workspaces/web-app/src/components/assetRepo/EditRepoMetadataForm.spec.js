import React from 'react';
import { shallow } from 'enzyme';
import { PureEditRepoMetadataForm } from './EditRepoMetadataForm';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';

jest.mock('../../hooks/reduxFormHooks');
reduxFormHooks.useReduxFormValue = jest.fn().mockResolvedValue('value');

describe('EditRepoMetadataForm', () => {
  const shallowRender = () => shallow(
    <PureEditRepoMetadataForm
      handleSubmit={jest.fn().mockName('handleSubmit')}
      reset={jest.fn().mockName('reset')}
      pristine={true}
      onCancel={jest.fn().mockName('onCancel')}
    />,
  );

  it('renders to match snapshot', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
