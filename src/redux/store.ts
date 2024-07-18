import { configureStore, combineReducers } from '@reduxjs/toolkit'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import authReducer from './slices/authSlice'
import usersReducer from './slices/usersSlice'
import inventoryReducer from './slices/inventorySlice'
import settingsReducer from './slices/settingsSlice'

// Persist configuration for auth reducer
const authPersistConfig = {
  key: 'auth',
  storage,
}

// Apply persist reducer only to auth reducer
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer)

// Combine reducers
const rootReducer = combineReducers({
  auth: persistedAuthReducer,
  users: usersReducer,
  inventory: inventoryReducer,
  settings: settingsReducer,
})

// Configure store
const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
