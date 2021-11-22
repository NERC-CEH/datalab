import React from 'react';
import { render, fireEvent, screen, within } from '@testing-library/react';
import { SITE_CATEGORY } from 'common/src/config/images';
import { useCurrentUserId } from '../../../hooks/authHooks';
import StackCardActions, { getSharedButtons } from './StackCardActions';
import { getUserActionsForType } from '../../../config/images';

jest.mock('../../../hooks/authHooks');
jest.mock('../../../config/images');
// eslint-disable-next-line global-require
jest.mock('./StackMoreMenuItem', () => require('react').forwardRef(({ onClick, children, requiredPermission, userPermissions, disabled }, ref) => (
  <div
    onClick={onClick}
    requiredpermission={requiredPermission}
    userpermissions={userPermissions.toString()}
  >
    {children}
    {`disabled: ${disabled}`}
  </div>)));

getUserActionsForType.mockReturnValue([]);

const openStackMock = jest.fn().mockName('openStack');
const deleteStackMock = jest.fn().mockName('deleteStack');
const editStackMock = jest.fn().mockName('editStack');
const shareStackMock = jest.fn().mockName('shareStack');
const restartStackMock = jest.fn().mockName('restartStack');
const copySnippetsMock = {
  Python: jest.fn().mockName('copyPythonSnippet'),
};

const getStack = () => ({
  id: 'abc1234',
  displayName: 'expectedDisplayName',
  type: 'expectedType',
  status: 'ready',
  users: ['owner-id'],
  shared: 'private',
  category: 'category',
});

const generateProps = () => ({
  stack: getStack(),
  openStack: openStackMock,
  deleteStack: deleteStackMock,
  editStack: editStackMock,
  shareStack: shareStackMock,
  restartStack: restartStackMock,
  copySnippets: copySnippetsMock,
  userPermissions: ['open', 'delete', 'edit'],
  openPermission: 'open',
  deletePermission: 'delete',
  editPermission: 'edit',
  scalePermission: 'scale',
  classes: {
    cardActions: 'cardActions',
    buttonWrapper: 'buttonWrapper',
  },
});

describe('StackCardActions', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useCurrentUserId.mockReturnValue('owner-id');
    getUserActionsForType.mockReturnValue({
      share: true,
      edit: true,
      restart: true,
      delete: true,
      logs: true,
      scale: true,
      copySnippets: false,
    });
  });

  it('creates correct snapshot', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));

    const menu = screen.getByRole('menu');

    // Assert
    expect(wrapper.container).toMatchSnapshot();
    expect(menu).toMatchSnapshot();
  });

  it('creates correct snapshot if there are multiple copy snippets', () => {
    // Arrange
    getUserActionsForType.mockReturnValueOnce({
      share: true,
      edit: true,
      restart: true,
      delete: true,
      logs: true,
      scale: true,
      copySnippets: true,
    });

    const props = {
      ...generateProps(),
      copySnippets: {
        Python: jest.fn().mockName('copyPythonSnippet'),
        R: jest.fn().mockName('copyRSnippet'),
      },
    };

    // Act
    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));

    // Assert
    expect(screen.getByRole('menu')).toMatchSnapshot();
  });

  it('Should render Open as disabled if stack is not ready', () => {
    // Arrange
    const baseProps = generateProps();
    const props = { ...baseProps, stack: { status: 'requested' } };
    // Act
    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));

    // Assert
    expect(wrapper.getByText('Open').closest('button').hasAttribute('disabled')).toBeTruthy();
  });

  it('Open button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<StackCardActions {...props} />);

    // Assert
    expect(openStackMock).not.toHaveBeenCalled();
    fireEvent.click(wrapper.getByText('Open'));
    expect(openStackMock).toHaveBeenCalledTimes(1);
    expect(openStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
      users: ['owner-id'],
      shared: 'private',
      category: 'category',
    });
  });

  it('Delete button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));

    const menu = screen.getByRole('menu');

    // Assert
    expect(deleteStackMock).not.toHaveBeenCalled();
    fireEvent.click(within(menu).getByText('Delete', { exact: false }));

    expect(deleteStackMock).toHaveBeenCalledTimes(1);
    expect(deleteStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
      users: ['owner-id'],
      shared: 'private',
      category: 'category',
    });
  });

  it('Edit button onClick function calls openStack with correct props', () => {
    // Arrange
    const props = generateProps();

    // Act
    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));
    const menu = screen.getByRole('menu');

    // Assert
    expect(editStackMock).not.toHaveBeenCalled();
    fireEvent.click(within(menu).getByText('Edit', { exact: false }));

    expect(editStackMock).toHaveBeenCalledTimes(1);
    expect(editStackMock).toHaveBeenCalledWith({
      displayName: 'expectedDisplayName',
      id: 'abc1234',
      type: 'expectedType',
      status: 'ready',
      users: ['owner-id'],
      shared: 'private',
      category: 'category',
    });
  });

  it('Should not render edit/delete/share/restart buttons if current user is not the owner', () => {
    const props = generateProps();
    useCurrentUserId.mockReturnValue('not-the-owner-id');

    const wrapper = render(<StackCardActions {...props} />);
    expect(wrapper.container).toMatchSnapshot();
  });

  it('Should render edit/delete/share/restart buttons if current user is not owner but is instance admin', () => {
    const props = generateProps();
    props.userPermissions = [...props.userPermissions, 'system:instance:admin'];
    useCurrentUserId.mockReturnValue('not-the-owner-id');

    const wrapper = render(<StackCardActions {...props} />);
    expect(wrapper.getByText('more_vert')).not.toBeNull();
  });

  it('Should not render edit/delete buttons if functions not defined', () => {
    const props = {
      ...generateProps(),
      editStack: undefined,
      deleteStack: undefined,
    };

    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));
    const menu = screen.getByRole('menu');
    expect(within(menu).queryByText('Edit')).toBeNull();
    expect(within(menu).queryByText('Delete')).toBeNull();
  });

  it('should not render button if userAction for that button is false', () => {
    const props = generateProps();
    // edit action is false so now the shouldRender prop of the edit button should be false
    getUserActionsForType.mockReturnValue({
      share: true,
      edit: false,
      restart: true,
      delete: true,
      logs: true,
      scale: true,
      copySnippets: false,
    });

    const wrapper = render(<StackCardActions {...props} />);
    fireEvent.click(wrapper.getByText('more_vert'));
    const menu = screen.getByRole('menu');
    expect(within(menu).queryByText('Edit')).toBeNull();
  });
});

describe('getSharedButtons', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  const permission = 'permission';

  const privateButton = disabled => ({
    onClick: expect.any(Function),
    requiredPermission: permission,
    name: 'Set Access: Private',
    disabled,
    tooltipText: 'Access already set to private',
    disableTooltip: !disabled,
  });
  const projectButton = disabled => ({
    onClick: expect.any(Function),
    requiredPermission: permission,
    name: 'Set Access: Project',
    disabled,
    tooltipText: 'Access already set to project',
    disableTooltip: !disabled,
  });
  const publicButton = disabled => ({
    onClick: expect.any(Function),
    requiredPermission: permission,
    name: 'Set Access: Public',
    disabled,
    tooltipText: 'Access already set to public',
    disableTooltip: !disabled,
  });

  it('creates the correct buttons for a private stack', () => {
    const stack = getStack();
    const buttons = getSharedButtons(stack, jest.fn(), permission);

    expect(buttons).toEqual([privateButton(true), projectButton(false), undefined]);
  });

  it('creates the correct buttons for a project stack', () => {
    const stack = {
      ...getStack(),
      shared: 'project',
    };
    const buttons = getSharedButtons(stack, jest.fn(), permission);

    expect(buttons).toEqual([privateButton(false), projectButton(true), undefined]);
  });

  it('creates the correct buttons for a public stack', () => {
    const stack = {
      ...getStack(),
      shared: 'public',
      category: SITE_CATEGORY,
    };
    const buttons = getSharedButtons(stack, jest.fn(), permission);

    expect(buttons).toEqual([privateButton(false), projectButton(false), publicButton(true)]);
  });

  it('creates the correct buttons for a private site', () => {
    const stack = {
      ...getStack(),
      shared: 'private',
      category: SITE_CATEGORY,
    };
    const buttons = getSharedButtons(stack, jest.fn(), permission);

    expect(buttons).toEqual([privateButton(true), projectButton(false), publicButton(false)]);
  });
});
