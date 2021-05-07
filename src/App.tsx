import React, { useCallback, useEffect, useState } from 'react';

import { Box, Grid, IconButton, InputBase, InputLabel, MenuItem, Select } from '@material-ui/core';
import { SelectInputProps } from '@material-ui/core/Select/SelectInput';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import SearchIcon from '@material-ui/icons/Search';
import { Pagination } from '@material-ui/lab';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';

import { CardComponent } from './components';
import { getLaunches, IQueryParam } from './services/launches';
import { StoreLaunchesData, StartLaunchesData } from './store/Launches/reducers';
import { LaunchesData, LoadingLaunchesData } from './store/Launches/selectors';
import { LaunchState } from './store/Launches/types';

const CardsPerPage = 12;
const nowDate = moment().format('YYYY-MM-DD');
const lastWeek = moment().subtract(1, 'week').format('YYYY-MM-DD');
const lastMonth = moment().subtract(1, 'month').format('YYYY-MM-DD');
const lastYear = moment().subtract(1, 'year').format('YYYY-MM-DD');

const App = () => {
	const classes = useStyles();
	const dispatch = useDispatch();
	const isLoading = useSelector(LoadingLaunchesData);
	const launches = useSelector(LaunchesData);

	const [pageNumber, setPageNumber] = useState<number>(1);
	const [total, setTotal] = useState<number>(0);
	const [queryRocketName, setQueryRocketName] = useState<string>('');
	const [filterLaunchDate, setFilterLaunchDate] = useState<string>('all');
	const [filterLaunchState, setFilterLaunchState] = useState<number>(0);

	const fetchLaunches = useCallback(
		async (limit?: number, offset?: number, params?: IQueryParam[]) => {
			dispatch(StartLaunchesData());
			const response = await getLaunches(limit, offset, params);
			if (response.status === 200) {
				setTotal(response.headers['spacex-api-count']);
				dispatch(StoreLaunchesData(response.data));
			}
		},
		[dispatch],
	);

	useEffect(() => {
		if (filterLaunchState !== 0) {
			if (filterLaunchState === LaunchState.Success) {
				fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage, [
					{ key: 'launch_success', value: true },
				]);
				return;
			}
			if (filterLaunchState === LaunchState.Fail) {
				fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage, [
					{ key: 'launch_success', value: false },
				]);
				return;
			}
		}
		if (filterLaunchDate !== 'all') {
			fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage, [
				{ key: 'start', value: filterLaunchDate },
				{ key: 'end', value: nowDate },
			]);
			return;
		}
		if (queryRocketName !== '') {
			fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage, [
				{ key: 'rocket_name', value: queryRocketName },
			]);
		} else {
			fetchLaunches(CardsPerPage, (pageNumber - 1) * CardsPerPage);
		}
	}, [pageNumber, filterLaunchState, filterLaunchDate, queryRocketName, fetchLaunches]);

	const handleChangePage = (_e: unknown, page: number) => {
		setPageNumber(page);
	};

	const handleChangeRocketName: React.ChangeEventHandler<
		HTMLTextAreaElement | HTMLInputElement
	> = (event) => {
		setQueryRocketName(event.target.value);
	};

	const handleSubmitSearch = () => {
		setPageNumber(1);
		setFilterLaunchDate('all');
		fetchLaunches(CardsPerPage, 0, [{ key: 'rocket_name', value: queryRocketName }]);
	};

	const handleChangeLaunchDateFilter: SelectInputProps['onChange'] = (event) => {
		setPageNumber(1);
		setFilterLaunchState(0);
		setFilterLaunchDate(event.target.value as string);
	};

	const handleChangeLaunchStateFilter: SelectInputProps['onChange'] = (event) => {
		setPageNumber(1);
		setFilterLaunchDate('all');
		setFilterLaunchState(event.target.value as number);
	};

	if (isLoading) <></>;

	return (
		<Box className={classes.container}>
			<Box className={classes.filterContainer}>
				<Box>
					<InputBase
						className={classes.input}
						placeholder="Search Rocket Name"
						inputProps={{ 'aria-label': 'search rocket name' }}
						onChange={handleChangeRocketName}
					/>
					<IconButton
						type="submit"
						className={classes.iconButton}
						aria-label="search"
						onClick={handleSubmitSearch}
					>
						<SearchIcon />
					</IconButton>
				</Box>
				<Box className={classes.filterContainer}>
					<InputLabel id="launch-date">Launch Date</InputLabel>
					<Select
						labelId="launch-date"
						id="launch-date"
						value={filterLaunchDate}
						onChange={handleChangeLaunchDateFilter}
						className={classes.inputSelect}
					>
						<MenuItem value="all">All</MenuItem>
						<MenuItem value={lastWeek}>Last Week</MenuItem>
						<MenuItem value={lastMonth}>Last Month</MenuItem>
						<MenuItem value={lastYear}>Last Year</MenuItem>
					</Select>
				</Box>
				<Box className={classes.filterContainer}>
					<InputLabel id="launch-stats">Launch Status</InputLabel>
					<Select
						labelId="launch-status"
						id="launch-status"
						value={filterLaunchState}
						onChange={handleChangeLaunchStateFilter}
						className={classes.inputSelect}
					>
						<MenuItem value={LaunchState.All}>All</MenuItem>
						<MenuItem value={LaunchState.Success}>Launch Succeed</MenuItem>
						<MenuItem value={LaunchState.Fail}>Launch Failed</MenuItem>
					</Select>
				</Box>
			</Box>
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
