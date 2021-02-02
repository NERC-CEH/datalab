import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useUsers } from '../../../hooks/usersHooks';
import sortByName from '../sortByName';

function UserMultiSelect(props) {
  const { label, selectedTip } = props;
  const users = useUsers();
  const sortedUsers = sortByName(users.value);
  const [currentValue, setCurrentValue] = useState([]); // use to give current value to onBlur

  return (
    <>
      {
      renderMultiSelectAutocompleteField(
        {
          meta: {}, // override with props if provided
          ...props,
          currentValue,
          setCurrentValue,
          options: sortedUsers,
          label,
          placeholder: "Type user's email address",
          getOptionLabel: val => val.name,
          getOptionSelected: (option, val) => option.userId === val.userId,
          loading: users.fetching,
          selectedTip,
        },
      )
    }
    </>
  );
}

export default UserMultiSelect;
