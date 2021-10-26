import React from 'react';
import { useDispatch } from 'react-redux';
import { shallow } from 'enzyme';
import { useVisibleAssets } from '../../../hooks/assetRepoHooks';
import AssetMultiSelect from './AssetMultiSelect';

jest.mock('react-redux');
jest.mock('../../../hooks/assetRepoHooks');

const asset1 = { assetId: 'asset-1', name: 'Asset 1', version: 'v1' };
const asset2 = { assetId: 'asset-2', name: 'Asset 2', version: 'v2' };

describe('AssetMultiSelect', () => {
  const shallowRender = () => {
    const props = {
      input: {
        value: [asset1, asset2],
        onChange: jest.fn().mockName('onChange'),
      },
    };

    return shallow(<AssetMultiSelect {...props} />);
  };

  beforeEach(() => {
    useDispatch.mockReturnValue(jest.fn().mockName('dispatch'));
    useVisibleAssets.mockReturnValue({ fetching: false, value: { assets: [asset1, asset2] } });
  });

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
