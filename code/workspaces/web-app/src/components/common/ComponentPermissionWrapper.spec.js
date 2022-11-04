import React from 'react';
import { render } from '../../testUtils/renderTests';
import { renderWithState, buildDefaultTestState } from '../../testUtils/renderWithState';
import PermissionWrapper, { CurrentUserPermissionWrapper } from './ComponentPermissionWrapper';

const renderBasicPermissionWrapper = props => render(
  <PermissionWrapper {...props}>
    <span>Has Permission</span>
  </PermissionWrapper>,
);

describe('PermissionWrapper', () => {
  let props;
  beforeEach(() => {
    props = {
      userPermissions: [],
      permission: 'expected-permission',
    };
  });

  it('renders children if user has expected permission', () => {
    props.userPermissions = ['expected-permission', 'another-permission'];

    const wrapper = renderBasicPermissionWrapper(props);

    expect(wrapper.queryByText('Has Permission')).not.toBeNull();
  });

  it('renders children if user has instance admin permission', () => {
    props.userPermissions = ['system:instance:admin'];

    const wrapper = renderBasicPermissionWrapper(props);

    expect(wrapper.queryByText('Has Permission')).not.toBeNull();
  });

  it('renders null if permissions do not match', () => {
    props.userPermissions = ['not-matching-permission', 'another-permission'];

    const wrapper = renderBasicPermissionWrapper(props);

    expect(wrapper.queryByText('Has Permission')).toBeNull();
  });
});

describe('CurrentUserPermissionWrapper', () => {
  let state;
  let props;
  beforeEach(() => {
    state = buildDefaultTestState();

    props = {
      permission: 'expected-permission',
      children: [(<span key={test}>Has Current User Permission</span>)],
    };
  });

  it('renders children if permissions on the state are correct', () => {
    state.authentication.permissions.value = ['expected-permission', 'another-permission'];
    const { wrapper } = renderWithState(state, CurrentUserPermissionWrapper, props);
    expect(wrapper.queryByText('Has Current User Permission')).not.toBeNull();
  });

  it('renders children if permissions on the state indicate an instance admin', () => {
    state.authentication.permissions.value = ['system:instance:admin'];
    const { wrapper } = renderWithState(state, CurrentUserPermissionWrapper, props);
    expect(wrapper.queryByText('Has Current User Permission')).not.toBeNull();
  });

  it('renders null if permissions on the state do not match', () => {
    state.authentication.permissions.value = ['not-matching-permission', 'another-permission'];
    const { wrapper } = renderWithState(state, CurrentUserPermissionWrapper, props);
    expect(wrapper.queryByText('Has Current User Permission')).toBeNull();
  });
});
