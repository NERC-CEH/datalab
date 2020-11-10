import { useSelector } from 'react-redux';
import reduxFormSelectors from '../selectors/reduxFormSelectors';

// eslint-disable-next-line import/prefer-default-export
export const useReduxFormValue = (formName, fieldName) => useSelector(
  reduxFormSelectors.reduxFormValue(formName, fieldName),
);
