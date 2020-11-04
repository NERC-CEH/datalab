import React from 'react';
import { shallow } from 'enzyme';
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

  const shallowRender = (props, itemText = 'Item Text') => shallow(
    <StackMoreMenuItem {...props}>{itemText}</StackMoreMenuItem>,
  );

  it('should render to match snapshot', () => {
    const props = generateProps();
    const render = shallowRender(props);
    expect(render).toMatchSnapshot();
  });

  it('should not render when shouldRender prop is falsey', () => {
    const props = generateProps({ shouldRender: false });
    const render = shallowRender(props);
    expect(render).toBeEmptyRender();
  });

  it('should not render when shouldRender prop is undefined', () => {
    const props = { ...generateProps(), shouldRender: undefined };
    const render = shallowRender(props);
    expect(render).toBeEmptyRender();
  });

  it('should not render when user does not have required permission', () => {
    const props = generateProps({ requiredPermission: 'does:not:exist' });
    const render = shallowRender(props);

    // Initial render returns permission wrapper that hasn't been evaluated yet.
    // Running a second shallow evaluates the permission wrapper
    expect(render.shallow()).toBeEmptyRender();
  });
});
