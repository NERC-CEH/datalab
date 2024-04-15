import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useUsers } from '../../../hooks/usersHooks';
import sortByName from '../sortByName';

function UserMultiSelect({ input, meta = null, fixedOptions = [], ...custom }) {
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
          options: sortedUsers.filter(user => user.verified),
          label: 'Users',
          placeholder: "Type user's email address",
          getOptionLabel: val => val.name,
          getOptionSelected: (option, val) => option.userId === val.userId,
          loading: users.fetching,
          selectedTip: 'User selected',
          fixedOptions,
          ...custom,
        },
      )
    }
    </>
  );
}

export default UserMultiSelect;
