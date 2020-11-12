import React from 'react';
import { renderMultiselectAutocompleteField } from '../../components/common/form/controls';
import { useUsers } from '../../hooks/usersHooks';
import sortByName from './sortByName';

function UserMultiSelect(props) {
  const { selectedUsers, setSelectedUsers } = props;
  const users = useUsers();

  const sortedUsers = sortByName(users.value);

  return (
    <>
      {
        renderMultiselectAutocompleteField(
          {
            input: {
              onChange: (val) => { setSelectedUsers(val); },
              value: selectedUsers,
            },
            options: sortedUsers,
            label: 'Users',
            placeholder: 'Filter by user',
            getOptionLabel: val => val.name,
            getOptionSelected: val => selectedUsers.includes(val),
            loading: users.fetching,
            selectedTip: 'User selected',
          },
        )
      }
    </>
  );
}

export default UserMultiSelect;
