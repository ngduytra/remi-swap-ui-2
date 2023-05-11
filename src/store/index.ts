import { configureStore } from '@reduxjs/toolkit'

import users from './users.controller'
import pools from './pools.controller'

const store = configureStore({
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
  devTools: false,
  reducer: {  users, pools },
})
export type AppState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
