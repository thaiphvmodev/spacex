import React, { useEffect, useState } from 'react';

import { Box, Grid } from '@material-ui/core';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Pagination } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';

import { CardComponent } from './components';
import './App.css';
import { getLaunches, IQueryParam } from './services/launches';
import { StoreLaunchesData, StartLaunchesData } from './store/Launches/reducers';
import { LaunchesData, LoadingLaunchesData } from './store/Launches/selectors';

const CardsPerPage = 12;

const App = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const isLoading = useSelector(LoadingLaunchesData);
	const launches = useSelector(LaunchesData);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);

	const fetchLaunches = async (limit?: number, offset?: number, params?: IQueryParam[]) => {
		dispatch(StartLaunchesData());
		const response = await getLaunches(limit, offset, params);
		if (response.status === 200) {
			setTotal(response.headers['spacex-api-count']);
			dispatch(StoreLaunchesData(response.data));
		}
	};

	useEffect(() => {
		fetchLaunches(CardsPerPage, 0);
	}, []);

	useEffect(() => {
		fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage);
	}, [pageNumber]);

	const handleChangePage = (e: any, page: number) => {
		setPageNumber(page);
	};

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
			<Box display="flex" justifyContent="center">
				{launches.length > 0 && (
					<Pagination
						count={Math.ceil(total / 12)}
						color="primary"
						onChange={handleChangePage}
						page={pageNumber}
					/>
				)}
			</Box>
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
