import React from 'react';
import { createShallow } from '@material-ui/core/test-utils';
import RemoveUserDialog from './RemoveUserDialog';

describe('RemoveUserDialog', () => {
  const classes = { dialogDeleteUserButton: 'dialogDeleteUserButton' };

  describe('when the dialog state has open equal to false', () => {
    let shallow;

    beforeEach(() => {
      shallow = createShallow();
    });

    it('renders as null', () => {
      expect(
        shallow(
          <RemoveUserDialog
            classes={classes}
            state={{ user: null, open: false }}
            setState={jest.fn()}
            onRemoveConfirmationFn={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });
  });

  describe('when the dialog state has open equal to true and a user set', () => {
    let shallow;

    beforeEach(() => {
      shallow = createShallow();
    });

    const openState = { user: { name: 'User One', userId: 'user-one-id' }, open: true };

    it('renders to match snapshot', () => {
      expect(
        shallow(
          <RemoveUserDialog
            classes={classes}
            state={openState}
            setState={jest.fn()}
            onRemoveConfirmationFn={jest.fn()}
            dispatch={jest.fn()}
          />,
        ),
      ).toMatchSnapshot();
    });

    it('closes when the cancel button is pressed and does not call confirmation function', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      const render = shallow(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          dispatch={jest.fn()}
        />,
      );
      render.find('#cancel-button').simulate('click');

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(0);
    });

    it('calls provided function and closes when the confirm button is pressed', () => {
      const mockSetState = jest.fn();
      const mockOnRemoveConfirmationFn = jest.fn();
      const mockDispatch = jest.fn();
      const projectName = 'project';
      const render = shallow(
        <RemoveUserDialog
          classes={classes}
          state={openState}
          setState={mockSetState}
          onRemoveConfirmationFn={mockOnRemoveConfirmationFn}
          project={projectName}
          dispatch={mockDispatch}
        />,
      );
      render.find('#remove-button').simulate('click');

      expect(mockSetState).toHaveBeenCalledTimes(1);
      expect(mockSetState).toHaveBeenCalledWith({ open: false, user: null });
      expect(mockOnRemoveConfirmationFn).toHaveBeenCalledTimes(1);
      expect(mockOnRemoveConfirmationFn)
        .toHaveBeenCalledWith(projectName, openState.user, mockDispatch);
    });
  });
});
