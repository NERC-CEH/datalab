import React from 'react';
import { shallow } from 'enzyme';
import { AddRepoMetadata } from './AddRepoMetadataDetails';
import * as reduxFormHooks from '../../hooks/reduxFormHooks';
import * as assetRepoHooks from '../../hooks/assetRepoHooks';

jest.mock('../../hooks/reduxFormHooks');
jest.mock('../../hooks/assetRepoHooks');

describe('AddRepoMetadataDetails', () => {
  beforeEach(() => {
    reduxFormHooks.useReduxFormValue = jest.fn().mockReturnValue('value');
    assetRepoHooks.useAssetRepo = jest.fn().mockReturnValue({ fetching: false, value: { createdAssetId: null } });
  });

  it('renders to match snapshot', () => {
    expect(shallow(
      <AddRepoMetadata
        handleSubmit={jest.fn().mockName('handleSubmit')}
        onCancel={jest.fn().mockName('onCancel')}
      />,
    )).toMatchSnapshot();
  });
});
