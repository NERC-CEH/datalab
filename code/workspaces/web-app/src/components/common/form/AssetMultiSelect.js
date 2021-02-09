// TODO - add unit tests
import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useAssetRepo } from '../../../hooks/assetRepoHooks';
import sortByName from '../sortByName';

function AssetMultiSelect({ input, meta = null, ...custom }) {
  const assetRepo = useAssetRepo();
  const sortedAssets = sortByName(assetRepo.value.assets);
  const [currentValue, setCurrentValue] = useState([]); // use to give current value to onBlur

  return (
    <>
      {
      renderMultiSelectAutocompleteField(
        {
          input,
          meta,
          currentValue,
          setCurrentValue,
          options: sortedAssets,
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
