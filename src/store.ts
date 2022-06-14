import { configureStore } from '@reduxjs/toolkit'
import { nodesApi } from './services/nodes'
import { messagesApi } from './services/messages'
import { nodeGeometriesSlice } from './slices/nodeGeometries'

export const store = configureStore({
  reducer: {
    [nodesApi.reducerPath]: nodesApi.reducer,
    [messagesApi.reducerPath]: messagesApi.reducer,
    [nodeGeometriesSlice.name]: nodeGeometriesSlice.reducer
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }).concat(
    nodesApi.middleware,
    messagesApi.middleware
  ),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch