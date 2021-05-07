import { createSlice } from '@reduxjs/toolkit';

import { ILaunch } from '../../services/launches';

export const launches = createSlice({
	name: 'launches',
	initialState: { launches: [] as ILaunch[], isLoading: true },
	reducers: {
		StartLaunchesData(state){
			state.isLoading = true
		},
		StoreLaunchesData(state,action){
			state.launches=action.payload
			state.isLoading = false
		},
		FetchLaunchesDataError(state,action){
			state.isLoading = true
		},
	},
});
export const { StartLaunchesData,StoreLaunchesData, FetchLaunchesDataError } = launches.actions
export default launches.reducer