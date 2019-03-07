import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Typography from '@material-ui/core/Typography';
import PromisedContentWrapper from '../common/PromisedContentWrapper';
import IconButton from '../common/control/IconButton';
import AutocompleteTextSearch from '../common/form/AutocompleteTextSearch';

const EditDataStoreDialog = ({ onCancel, title, currentUsers, userList, addUser, removeUser, loadUsersPromise }) => (
    <Dialog open={true} maxWidth="md" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography variant="subtitle1" gutterBottom>
          Users with access to data store
        </Typography>
        <PromisedContentWrapper promise={loadUsersPromise} >
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
