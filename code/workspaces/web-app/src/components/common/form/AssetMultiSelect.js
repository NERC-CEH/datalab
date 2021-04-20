import React, { useState } from 'react';
import { renderMultiSelectAutocompleteField } from './controls';
import { useAssetRepo, useVisibleAssets } from '../../../hooks/assetRepoHooks';
import assetLabel from './assetLabel';

function AssetMultiSelect({ input, meta = null, showAllAssets, projectKey = undefined, ...custom }) {
  const projectAssets = useVisibleAssets(projectKey);
  const allAssets = useAssetRepo();
  const assetRepo = showAllAssets ? allAssets : projectAssets;
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
          getOptionLabel: assetLabel,
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
