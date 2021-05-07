import { configureStore } from '@reduxjs/toolkit'

import launches from './Launches/reducers'



const rootReducer = {
  launchesReducer: launches,
}

export const store = configureStore({ reducer:rootReducer })
export type RootState = ReturnType<typeof store.getState>
export default store;