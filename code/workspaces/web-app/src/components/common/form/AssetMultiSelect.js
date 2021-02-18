import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useVisibleAssets } from '../../../hooks/assetRepoHooks';

function AssetMultiSelect({ input, meta = null, projectKey, ...custom }) {
  const assetRepo = useVisibleAssets(projectKey);
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
          options: assetRepo.value.assets,
          label: 'Assets',
          placeholder: 'Filter by asset name or location',
          getOptionLabel: val => `${val.name}:${val.version} (${val.fileLocation})`,
          getOptionSelected: (option, val) => option.assetId === val.assetId,
          loading: assetRepo.fetching,
          selectedTip: 'Asset selected',
          ...custom,
        },
      )
    }
    </>
  );
}

export default AssetMultiSelect;
