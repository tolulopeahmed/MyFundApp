// store.js

import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import bankReducer from './ReduxReducers';

const rootReducer = combineReducers({
  bank: bankReducer,
  // Add other reducers for different functionalities here
});

const store = configureStore({
    reducer: rootReducer,
    // You can add middleware or other store configuration options here if needed
  });


export default store;
