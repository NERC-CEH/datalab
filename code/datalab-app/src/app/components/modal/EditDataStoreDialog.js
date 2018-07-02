import React from 'react';
import PropTypes from 'prop-types';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import Typography from 'material-ui/Typography';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import IconButton from '../common/control/IconButton';
import AutocompleteTextSearch from '../common/form/AutocompleteTextSearch';

const EditDataStoreDialog = ({ onCancel, title, currentUsers, userList, addUser, removeUser, loadUsersPromise }) => (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <PromisedContentWrapper promise={loadUsersPromise} >
          <Typography type="subheading" gutterBottom>
            Users with access to data store
          </Typography>
          <AutocompleteTextSearch
            suggestions={userList}
            selectedItems={currentUsers}
            addItem={addUser}
            removeItem={removeUser}
            placeholder={"Type user's email address"}
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
  currentUsers: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  userList: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
    }),
  ).isRequired,
  addUser: PropTypes.func.isRequired,
  removeUser: PropTypes.func.isRequired,
  loadUsersPromise: PropTypes.shape({
    error: PropTypes.any,
    fetching: PropTypes.bool.isRequired,
    value: PropTypes.array.isRequired,
  }).isRequired,
};

export default EditDataStoreDialog;
