import { configureStore } from '@reduxjs/toolkit'

import reducer from './Launches/reducers'



const rootReducer = {
  launchesReducer: reducer,
}

export const store = configureStore({ reducer:rootReducer })
export type RootState = ReturnType<typeof store.getState>
export default store;