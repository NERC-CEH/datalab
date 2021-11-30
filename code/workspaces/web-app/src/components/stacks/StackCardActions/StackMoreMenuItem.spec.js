import React from 'react';
import { render } from '@testing-library/react';
import StackMoreMenuItem from './StackMoreMenuItem';

describe('StackMoreMenuItem', () => {
  const generateProps = (propOverrides = {}) => {
    const {
      shouldRender = true,
      onClick = jest.fn().mockName('onClick'),
      disabled = false,
      userPermissions = ['stack:edit', 'stack:create'],
      requiredPermission = 'stack:edit',
      tooltipText = '',
      disableTooltip = false,
    } = propOverrides;

    return ({
      shouldRender,
      onClick,
      disabled,
      userPermissions,
      requiredPermission,
      tooltipText,
      disableTooltip,
    });
  };

  const shallowRender = (props, itemText = 'Item Text') => render(
    <StackMoreMenuItem {...props}>{itemText}</StackMoreMenuItem>,
  ).container;

  it('should render to match snapshot', () => {
    const props = generateProps();
    const container = shallowRender(props);
    expect(container).toMatchSnapshot();
  });

  it('should not render when shouldRender prop is falsey', () => {
    const props = generateProps({ shouldRender: false });
    const container = shallowRender(props);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when shouldRender prop is undefined', () => {
    const props = { ...generateProps(), shouldRender: undefined };
    const container = shallowRender(props);
    expect(container.firstChild).toBeNull();
  });

  it('should not render when user does not have required permission', () => {
    const props = generateProps({ requiredPermission: 'does:not:exist' });
    const container = shallowRender(props);
    expect(container.firstChild).toBeNull();
  });
});
