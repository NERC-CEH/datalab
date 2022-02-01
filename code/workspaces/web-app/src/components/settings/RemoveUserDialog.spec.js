import React from 'react';
import { render, screen, fireEvent } from '../../testUtils/renderTests';
import RemoveUserDialog from './RemoveUserDialog';

describe('RemoveUserDialog', () => {
  const classes = { dialogDeleteUserButton: 'dialogDeleteUserButton' };

  describe('when the dialog state has open equal to false', () => {
    it('renders as null', () => {
      render(
        <RemoveUserDialog
          classes={classes}
          state={{ user: null, open: false }}
          setState={jest.fn()}
          onRemoveConfirmationFn={jest.fn()}
          dispatch={jest.fn()}
        />,
      );
      expect(screen.queryByText('Remove User Permissions?')).toBeNull();
    });
  });

  describe('when the dialog state has open equal to true and a user set', () => {
    const openState = { user: { name: 'User One', userId: 'user-one-id' }, open: true };

    it('renders to match snapshot', () => {
      render(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={jest.fn()}
          onRemoveConfirmationFn={jest.fn()}
          dispatch={jest.fn()}
        />,
      );

      expect(screen.getByText('Remove User Permissions?').parentElement.parentElement.parentElement).toMatchSnapshot();
    });

    it('closes when the cancel button is pressed and does not call confirmation function', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      render(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          dispatch={jest.fn()}
        />,
      );
      fireEvent.click(document.querySelector('[id="cancel-button"]'));

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(0);
    });

    it('calls provided function and closes when the confirm button is pressed', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      const mockDispatch = jest.fn();
      const projectKey = 'project';
      render(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          projectKey={projectKey}
          dispatch={mockDispatch}
        />,
      );
      fireEvent.click(document.querySelector('[id="remove-button"]'));

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(1);
      expect(mockOnRemoveConfirmationFn)
        .toHaveBeenCalledWith(projectKey, openState.user, mockDispatch);
    });
  });
});
