import React from 'react';
import { renderMultiselectAutocompleteField } from '../../components/common/form/controls';
import { useProjectsArray } from '../../hooks/projectsHooks';
import sortByName from './sortByName';

function ProjectMultiSelect(props) {
  const { selectedProjects, setSelectedProjects } = props;
  const projects = useProjectsArray();

  const sortedProjects = sortByName(projects.value);

  return (
    <>
      {
      renderMultiselectAutocompleteField(
        {
          input: {
            onChange: (val) => { setSelectedProjects(val); },
            value: selectedProjects,
          },
          options: sortedProjects,
          label: 'Projects',
          placeholder: 'Filter by project',
          getOptionLabel: val => val.name,
          getOptionSelected: val => selectedProjects.includes(val),
          loading: projects.fetching,
          selectedTip: 'Project selected',
        },
      )
    }
    </>
  );
}

export default ProjectMultiSelect;
