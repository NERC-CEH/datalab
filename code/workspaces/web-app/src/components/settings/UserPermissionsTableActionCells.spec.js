import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { PERMISSION_VALUES, PERMISSIONS } from '../../constants/permissions';
import { CheckboxCell, PermissionsCheckbox, RemoveUserButtonCell } from './UserPermissionsTableActionCells';

jest.mock('@material-ui/core/Checkbox', () => props => (<div onClick={props.onClick}>CheckBox mock {JSON.stringify(props)}</div>));

describe('CheckboxCell', () => {
  const classes = {
    activeSelection: 'active',
    implicitSelection: 'implicit',
  };

  it('renders correctly passing props to PermissionsCheckbox in TableCell', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };

    expect(
      render(
        <table>
          <tbody>
            <tr>
              <CheckboxCell
                user={user}
                isCurrentUser={false}
                checkboxSpec={checkboxSpec}
                projectKey="projectKey"
                classes={classes}
                cellKey="key"
                dispatch={jest.fn()}
              />
          </tr>
        </tbody>
      </table>,
      ).container,
    ).toMatchSnapshot();
  });
});

describe('PermissionsCheckbox', () => {
  const classes = {
    activeSelection: 'active',
    implicitSelection: 'implicit',
  };

  describe('when user has rights equal to CheckboxSpec', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    it('returns an checked active selection check box', () => {
      expect(
        render(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  describe('when user has rights greater than CheckboxSpec', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.USER, value: PERMISSION_VALUES.USER };
    it('returns an checked implicit selection check box', () => {
      expect(
        render(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  describe('when user has rights less than CheckboxSpec', () => {
    const user = { role: PERMISSIONS.VIEWER };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };
    it('returns an unchecked check box', () => {
      expect(
        render(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={false}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  describe('when checkbox user is the current user', () => {
    const user = { role: PERMISSIONS.ADMIN };
    const checkboxSpec = { name: PERMISSIONS.USER, value: PERMISSION_VALUES.USER };

    it('renders with correct check status and as disabled', () => {
      expect(
        render(
          <PermissionsCheckbox
            user={user}
            isCurrentUser={true}
            checkboxSpec={checkboxSpec}
            project="project"
            classes={classes}
            dispatch={jest.fn()}
          />,
        ).container,
      ).toMatchSnapshot();
    });
  });

  describe('when the checkbox is clicked', () => {
    const mockActions = {
      addUserPermission: jest.fn(),
    };
    mockActions.addUserPermission.mockReturnValue('expected-result');

    const mockDispatch = jest.fn();
    const projectKey = 'projectKey';
    const user = { name: 'User One', userId: 'user-one-id', role: PERMISSIONS.USER };
    const checkboxSpec = { name: PERMISSIONS.ADMIN, value: PERMISSION_VALUES.ADMIN };

    it('dispatches update action with correct user and new permission level', () => {
      const wrapper = render(
        <PermissionsCheckbox
          user={user}
          isCurrentUser={true}
          checkboxSpec={checkboxSpec}
          projectKey={projectKey}
          classes={classes}
          actions={mockActions}
          dispatch={mockDispatch}
        />,
      );
      fireEvent.click(wrapper.getByText('CheckBox mock', { exact: false }));
      expect(mockActions.addUserPermission).toHaveBeenCalledTimes(1);
      expect(mockActions.addUserPermission).toHaveBeenCalledWith(projectKey, user, checkboxSpec.name, mockDispatch);
    });
  });
});

describe('RemoveUserButtonCell', () => {
  const classes = { tableCell: 'tableCell' };
  const user = { name: 'User One', userId: 'user-one-id' };

  it('renders as disabled when on the row of the current user', () => {
    expect(
      render(
        <table>
          <tbody>
            <tr>
        <RemoveUserButtonCell
          user={user}
          isCurrentUser={true}
          classes={classes}
          setRemoveUserDialogState={jest.fn()}
        />
        </tr>
        </tbody>
        </table>,
      ).container,
    ).toMatchSnapshot();
  });

  it('sets the remove user dialog state so it opens when clicked', () => {
    const mockSetRemoveUserDialogState = jest.fn();
    const wrapper = render(
      <table>
          <tbody>
            <tr>
      <RemoveUserButtonCell
        user={user}
        isCurrentUser={true}
        currentUserSystemAdmin={true}
        classes={classes}
        setRemoveUserDialogState={mockSetRemoveUserDialogState}
      />
      </tr>
        </tbody>
        </table>,
    );

    fireEvent.click(wrapper.getByRole('button'));

    expect(mockSetRemoveUserDialogState).toHaveBeenCalledTimes(1);
    expect(mockSetRemoveUserDialogState).toHaveBeenCalledWith({ user, open: true });
  });
});
