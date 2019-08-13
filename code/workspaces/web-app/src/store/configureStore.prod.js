import { createStore, applyMiddleware } from 'redux';
import rootReducer from '../reducers';
import middleware from './middleware';
import browserHistory from './browserHistory';

export default function configureStore(initialState) {
  return createStore(
    rootReducer(browserHistory),
    initialState,
    applyMiddleware(...middleware),
  );
}
