import { change } from 'redux-form';

export const getTypeOptions = imageOptions => Object.entries(imageOptions).map(
  ([name, info]) => ({ value: name, text: info.displayName }),
);

export const getVersionOptions = (imageOptions, type) => {
  if (!imageOptions[type] || !imageOptions[type].userSelectableVersion) {
    return [];
  }

  return imageOptions[type].versions.map(
    item => ({
      value: item.displayName,
      text: item.displayName,
      default: item.default,
      additionalText: item.default ? '(default)' : undefined,
    }),
  );
};

export const updateVersionOnTypeChange = (formName, typeFieldName, versionFieldName, versionOptions) => (values, dispatch, props, previousValues) => {
  if (values[typeFieldName] !== previousValues[typeFieldName]) {
    let versionsList = versionOptions.filter(item => item.default);
    if (versionsList.length === 0) {
      versionsList = versionOptions;
    }
    dispatch(
      change(
        formName,
        versionFieldName,
        versionsList.length > 0 ? versionsList[0].value : '',
      ),
    );
  }
};

export const getCanChooseFile = (imageOptions, type) => imageOptions[type] && imageOptions[type].userCanChooseFile;
export const getCanChooseConda = (imageOptions, type) => imageOptions[type] && imageOptions[type].userCanChooseConda;
