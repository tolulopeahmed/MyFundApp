// ReduxStore.js

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import Reducer from './ReduxReducers';

const rootReducer = combineReducers({
  bank: Reducer,
  // Add other reducers for different functionalities here
});

const store = configureStore({
  reducer: rootReducer,
  // You can add middleware or other store configuration options here if needed
});

export default store;
