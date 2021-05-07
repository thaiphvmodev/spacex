
import { RootState } from "../configureStore";

export const LaunchesData = (state:RootState) => state.launchesReducer.launches
export const LoadingLaunchesData = (state:RootState) => state.launchesReducer.isLoading