import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import middleware from './middleware';
import logger from 'redux-logger';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middleware, logger))
  );
}
