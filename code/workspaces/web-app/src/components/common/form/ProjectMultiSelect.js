import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useProjectsArray } from '../../../hooks/projectsHooks';
import sortByName from '../sortByName';

function ProjectMultiSelect(props) {
  const projects = useProjectsArray();
  const sortedProjects = sortByName(projects.value);
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
          options: sortedProjects,
          label: 'Projects',
          placeholder: 'Filter by project',
          getOptionLabel: val => val.name,
          getOptionSelected: (option, val) => option.key === val.key,
          loading: projects.fetching,
          selectedTip: 'Project selected',
        },
      )
    }
    </>
  );
}

export default ProjectMultiSelect;
