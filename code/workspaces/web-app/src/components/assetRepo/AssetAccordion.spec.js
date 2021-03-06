import React from 'react';
import * as ReactRedux from 'react-redux';
import { shallow } from 'enzyme';
import AssetAccordion from './AssetAccordion';

jest.mock('react-router');
const dispatchMock = jest.fn().mockName('dispatch');
jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

describe('AssetAccordion', () => {
  const shallowRender = () => {
    const asset = {
      name: 'asset name',
      version: 'asset version',
      assetId: 'asset-1',
      fileLocation: 'file location',
      masterUrl: 'master URL',
      owners: [{ userId: 'owner-1', name: 'name 1' }, { userId: 'owner-2', name: 'name 2' }],
      visibility: 'BY_PROJECT',
      projects: [{ projectKey: 'project-1', name: 'project 1' }, { projectKey: 'project-2', name: 'project 2' }],
    };

    return shallow(<AssetAccordion asset={asset} />);
  };

  it('renders to match snapshot passing correct props to children', () => {
    expect(shallowRender()).toMatchSnapshot();
  });
});
