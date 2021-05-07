import React from 'react';

import {
	Box,
	Card,
	CardActionArea,
	CardContent,
	CardMedia,
	Chip,
	Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

import { ILaunch } from '../services/launches';

export interface CardComponentProps {
	cardInfo: ILaunch;
}

const renderMissionStatus = (successState: boolean) => {
	if (successState) {
		return <Chip label="Mission Success" color="primary" />;
	}
	return <Chip label="Mission Failed" color="default" />;
};

export const CardComponent: React.FC<CardComponentProps> = ({ cardInfo }) => {
	const classes = useStyles();
	return (
		<Box className={classes.cardBox}>
			<Card className={classes.root}>
				<CardActionArea>
					<CardMedia
						className={classes.media}
						image={cardInfo.links?.mission_patch_small}
						title="Contemplative Reptile"
					/>
					<CardContent>
						<Box className={classes.missionName}>
							<Typography gutterBottom variant="inherit" component="h2">
								{cardInfo.mission_name}
							</Typography>
						</Box>
						<Box className={classes.missionStatus}>
							{renderMissionStatus(cardInfo.launch_success)}
						</Box>
						<Typography
							variant="body2"
							color="textSecondary"
							component="p"
							className={classes.description}
						>
							{cardInfo.details}
						</Typography>
					</CardContent>
				</CardActionArea>
			</Card>
		</Box>
	);
};
export default CardComponent;
const useStyles = makeStyles({
	root: {
		width: '100%',
	},
	media: {
		height: 140,
		backgroundSize: 'contain',
		marginTop: '15px',
	},
	cardBox: {
		padding: '10px',
	},
	missionName: {
		display: 'flex',
		justifyContent: 'center',
		minHeight: '100px',
		alignItems: 'center',
	},
	missionStatus: {
		display: 'flex',
		justifyContent: 'center',
		marginBottom: '30px',
	},
	description: {
		WebkitLineClamp: 3,
		position: 'relative',
		overflow: 'hidden',
		display: '-webkit-box',
		WebkitBoxOrient: 'vertical',
		height: '60px',
	},
});
