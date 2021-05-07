import React, { useEffect } from 'react';

import { Box, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';

import { CardComponent } from './components';
import './App.css';
import { getLaunches, IQueryParam } from './services/launches';
import { StoreLaunchesData, StartLaunchesData } from './store/Launches/reducers';
import { LaunchesData, LoadingLaunchesData } from './store/Launches/selectors';

const App = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const isLoading = useSelector(LoadingLaunchesData);
	const launches = useSelector(LaunchesData);

	const fetchLaunches = async (limit?: number, offset?: number, params?: IQueryParam[]) => {
		dispatch(StartLaunchesData());
		const response = await getLaunches(limit, offset, params);
		if (response.status === 200) {
			dispatch(StoreLaunchesData(response.data));
		}
	};
	useEffect(() => {
		fetchLaunches();
	}, []);
	if (isLoading) <></>;

	return (
		<Box className={classes.container}>
			<Box className={classes.listCardContainer}>
				<Grid container spacing={2} wrap="wrap">
					{launches.map((item, index) => (
						<Grid item xs={4} sm={3} lg={2} key={index.toString()}>
							<CardComponent key={index.toString()} cardInfo={item} />
						</Grid>
					))}
				</Grid>
			</Box>
			<Box display="flex" justifyContent="center" />
		</Box>
	);
};
export default App;

const useStyles = makeStyles((theme: Theme) =>
	createStyles({
		input: {
			marginLeft: theme.spacing(1),
			flex: 1,
		},
		iconButton: {
			padding: 10,
		},
		filterContainer: {
			display: 'flex',
			alignItems: 'center',
			padding: '10px',
		},
		cardContainer: {
			display: 'flex',
			justifyContent: 'center',
			marginTop: '30px',
		},
		inputSelect: {
			minWidth: '100px',
			marginLeft: '10px',
		},
		container: {
			padding: 20,
			alignItems: 'center',
			justifyContent: 'center',
		},
		listCardContainer: {
			marginTop: '10px',
		},
	}),
);
