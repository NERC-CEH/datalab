import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import middleware from './middleware';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    applyMiddleware(...middleware),
  );
}
