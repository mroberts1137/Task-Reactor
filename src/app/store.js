import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { goalsReducer } from './goalsSlice';
import { taskReducer } from './taskSlice';
import { loadStateReducer } from './loadStateReducer';

const persistConfig = {
  key: 'root',
  storage
  // MODEL A
  // transforms: [
  //   {
  //     serialize: (state) => state,
  //     deserialize: (state) => {
  //       // Check if the state is valid
  //       if (state.tasks.taskArray.every((task) => task.id && task.name)) {
  //         return state;
  //       } else {
  //         return undefined; // Return undefined to start with a new state
  //       }
  //     }
  //   }
  // ]
  // MODEL B
  // deserialize: (storedState) => {
  //   if (storedState && storedState.tasks && storedState.tasks.taskArray) {
  //     return storedState;
  //   }
  //   return undefined;
  // }
};

// storage.removeItem('persist:root');

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
