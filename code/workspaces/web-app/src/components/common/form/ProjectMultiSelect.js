import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useProjectsArray } from '../../../hooks/projectsHooks';
import sortByName from '../sortByName';

function ProjectMultiSelect({ input, meta = null, ...custom }) {
  const projects = useProjectsArray();
  const sortedProjects = sortByName(projects.value);
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
          options: sortedProjects,
          label: 'Projects',
          placeholder: 'Filter by project',
          getOptionLabel: val => val.name,
          getOptionSelected: (option, val) => option.key === val.key,
          loading: projects.fetching,
          selectedTip: 'Project selected',
          ...custom,
        },
      )
    }
    </>
  );
}

export default ProjectMultiSelect;
