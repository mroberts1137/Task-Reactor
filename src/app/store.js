import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { goalsReducer } from './goalsReducer';
import { taskReducer } from './taskReducer';
import { loadStateReducer } from './loadStateReducer';

const persistConfig = {
  key: 'root',
  storage
};

storage.removeItem('persist:root');

const rootReducer = combineReducers({
  goals: goalsReducer,
  tasks: taskReducer,
  loadState: loadStateReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer
});

export const persistor = persistStore(store);
