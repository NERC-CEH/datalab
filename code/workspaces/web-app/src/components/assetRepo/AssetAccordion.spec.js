import React from 'react';
import * as ReactRedux from 'react-redux';
import { render, fireEvent, screen, within } from '@testing-library/react';
import AssetAccordion from './AssetAccordion';
import { useCurrentUserPermissions, useCurrentUserId } from '../../hooks/authHooks';

jest.mock('react-router');
const dispatchMock = jest.fn().mockName('dispatch');
jest.spyOn(ReactRedux, 'useDispatch').mockImplementation(() => dispatchMock);

jest.mock('./AssetCard', () => props => (<>{`Asset: ${JSON.stringify(props.asset)}`}</>));
jest.mock('../../hooks/authHooks');

describe('AssetAccordion', () => {
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

  beforeEach(() => {
    jest.clearAllMocks();

    useCurrentUserPermissions.mockReturnValue({ value: ['permission'] });
    useCurrentUserId.mockReturnValue('owner-1');
  });

  it('renders to match snapshot passing correct props to children', () => {
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders without an Edit button when user is not a data manager or asset owner', () => {
    useCurrentUserId.mockReturnValueOnce('another-owner');
    const wrapper = render(<AssetAccordion asset={asset}/>);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('opens the more menu when the button is clicked', () => {
    const wrapper = render(<AssetAccordion asset={asset}/>);

    const preClickMenus = screen.queryByRole('menu');
    expect(preClickMenus).toBeNull();

    // Click menu button
    fireEvent.click(wrapper.getByText('more_vert'));

    const menu = screen.getByRole('menu');
    expect(within(menu).queryByText('Add to Notebook')).toMatchSnapshot();
  });
});
