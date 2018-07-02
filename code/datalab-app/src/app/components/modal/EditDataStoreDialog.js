import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import IconButton from '../common/control/IconButton';
import AutocompleteTextSearch from '../common/form/AutocompleteTextSearch';

const EditDataStoreDialog = ({ onCancel, title, currentUsers, userList, addUser, removeUser, loadUsersPromise }) => (
    <Dialog open={true} maxWidth="md">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <PromisedContentWrapper promise={loadUsersPromise} >
          <AutocompleteTextSearch
            suggestions={userList}
            selectedItems={currentUsers}
            addItem={addUser}
            removeItem={removeUser}
          />
        </PromisedContentWrapper>
      </DialogContent>
      <DialogActions>
        <IconButton onClick={onCancel} icon="clear">Close</IconButton>
      </DialogActions>
    </Dialog>
  );

EditDataStoreDialog.propTypes = {
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  // currentUsers: PropTypes.array.isRequired,
  // userList: PropTypes.array.isRequired,
};

export default EditDataStoreDialog;
