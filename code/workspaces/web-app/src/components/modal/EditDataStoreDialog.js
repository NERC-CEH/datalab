import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import dataStorageActions from '../../actions/dataStorageActions';
import modalDialogActions from '../../actions/modalDialogActions';
import notify from '../common/notify';
import EditDataStoreForm from '../dataStorage/editDataStoreForm';

const getUserIdsFromUsers = users => users.map(user => user.value);
const sortUsersByLabel = users => (
  [...users].sort(
    (a, b) => {
      if (a.label < b.label) return -1;
      if (a.label > b.label) return 1;
      return 0;
    },
  )
);

export const getOnDetailsEditSubmit = (projectKey, stackName, typeName) => async (values, dispatch) => {
  dispatch(modalDialogActions.closeModalDialog());

  const updatedValues = { ...values, users: getUserIdsFromUsers(values.users) };
  try {
    await dispatch(
      dataStorageActions.editDataStoreDetails(
        projectKey, stackName, updatedValues,
      ),
    );
    notify.success(`${typeName} updated`);
  } catch (error) {
    notify.error(`Unable to update ${typeName}`);
  } finally {
    await dispatch(dataStorageActions.loadDataStorage(projectKey));
  }
};

const EditDataStoreDialog = ({
  onCancel, title, currentUsers, userList, usersFetching, stack, projectKey, typeName,
}) => (
  <Dialog open={true} maxWidth="md" fullWidth>
    <DialogTitle>{title}</DialogTitle>
    <DialogContent>
      <EditDataStoreForm
        userList={sortUsersByLabel(userList.filter(user => user.verified))}
        usersFetching={usersFetching}
        onSubmit={getOnDetailsEditSubmit(projectKey, stack.name, typeName)}
        onCancel={onCancel}
        initialValues={{
          displayName: stack.displayName,
          description: stack.description,
          users: currentUsers,
        }}
      />
    </DialogContent>
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
  usersFetching: PropTypes.bool.isRequired,
  stack: PropTypes.shape({
    name: PropTypes.string.isRequired,
    displayName: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  projectKey: PropTypes.string.isRequired,
  typeName: PropTypes.string.isRequired,
};

export default EditDataStoreDialog;
