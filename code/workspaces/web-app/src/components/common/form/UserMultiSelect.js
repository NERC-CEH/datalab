import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useUsers } from '../../../hooks/usersHooks';
import sortByName from '../sortByName';

function UserMultiSelect({ input, meta = null, ...custom }) {
  const users = useUsers();
  const sortedUsers = sortByName(users.value);
  const [currentValue, setCurrentValue] = useState(input.value || []); // use to give current value to onBlur

  return (
    <>
      {
      renderMultiSelectAutocompleteField(
        {
          input,
          meta,
          currentValue,
          setCurrentValue,
          options: sortedUsers,
          label: 'Users',
          placeholder: "Type user's email address",
          getOptionLabel: val => val.name,
          getOptionSelected: (option, val) => option.userId === val.userId,
          loading: users.fetching,
          selectedTip: 'User selected',
          ...custom,
        },
      )
    }
    </>
  );
}

export default UserMultiSelect;
