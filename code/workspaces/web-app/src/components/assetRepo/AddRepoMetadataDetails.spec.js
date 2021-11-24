import React from 'react';
import { reduxForm } from 'redux-form';
import { AddRepoMetadata } from './AddRepoMetadataDetails';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';
import * as assetRepoHooks from '../../hooks/assetRepoHooks';
import { renderWithState, buildDefaultTestState } from '../../testUtils/renderWithState';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('../../hooks/assetRepoHooks');

jest.mock('../common/form/UserMultiSelect', () => props => (<div>UserMultiSelect mock {JSON.stringify(props)}</div>));

describe('AddRepoMetadataDetails', () => {
  beforeEach(() => {
    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('value');
    assetRepoHooks.useAssetRepo = jest.fn().mockReturnValue({ fetching: false, value: { createdAssetId: null } });
  });

  it('renders to match snapshot', () => {
    const Wrapper = reduxForm({ form: 'test form' })(AddRepoMetadata);
    const props = {
      handleSubmit: jest.fn().mockName('handleSubmit'),
      onCancel: jest.fn().mockName('onCancel'),
    };
    const { wrapper } = renderWithState(buildDefaultTestState(), Wrapper, props);
    expect(wrapper.container).toMatchSnapshot();
  });
});
