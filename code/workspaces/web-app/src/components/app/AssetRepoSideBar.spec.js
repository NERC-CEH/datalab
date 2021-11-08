import React from 'react';
import { permissionTypes } from 'common';
import {
  renderWithState,
  buildDefaultTestState,
} from '../../testUtils/renderWithState';
import AssetRepoSideBar from './AssetRepoSideBar';

jest.mock('./SideBarButton', () => props => <div {...props}>{props.label}</div>);

const classes = {
  itemList: 'itemList',
  sideBar: 'sideBar',
};

describe('AssetRepoSideBar', () => {
  it('renders correctly when user has no permissions', () => {
    const props = { classes };

    const state = {
      ...buildDefaultTestState(),
    };

    const { wrapper } = renderWithState(state, AssetRepoSideBar, props);

    expect(wrapper.container).toMatchSnapshot();
  });

  it('renders correctly when user is a Data Manager', () => {
    const props = { classes };

    const defaultState = buildDefaultTestState();
    const state = {
      ...defaultState,
      authentication: {
        ...defaultState.authentication,
        permissions: {
          ...defaultState.permissions,
          value: [permissionTypes.SYSTEM_DATA_MANAGER],
        },
      },
    };

    const { wrapper } = renderWithState(state, AssetRepoSideBar, props);

    expect(wrapper.container).toMatchSnapshot();
  });
});
