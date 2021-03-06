import React, { useState, useEffect } from "react";
import Calendar from "../Calendar/Calendar";
import Nav from "../Nav/Nav";
import AutoCompleteCalorieSearch from "./AutoCompleteCalorieSearch";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import LoadingCard from "../Loading/LoadingCard";
import { getDailyFoodInfoByAPIMethod } from "../../api/client.js";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
	root: {
		height: 180,
	},
	container: {
		display: "flex",
	},
	paper: {
		margin: theme.spacing(1),
	},
	svg: {
		width: 100,
		height: 100,
	},
	polygon: {
		fill: theme.palette.common.white,
		stroke: theme.palette.divider,
		strokeWidth: 1,
	},
}));
const LogCalories = (props) => {
	// Returns current date as string
	const addDate = () => {
		let date = new Date();
		date =
			date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
		return date;
	};

	const flipHandler = (e) => {
		e.preventDefault();
		setIsFlipped(!isFlipped);
	};
	const [dateState, setDateState] = useState(addDate());
	const [isFlipped, setIsFlipped] = useState(false); // card flip state
	const [foodStateByDate, setFoodStateByDate] = useState(""); // daily food intake state
	const [isFoodStateLoading, setIsFoodStateLoading] = useState(true); // is daily food info being fetched from db?
	const classes = useStyles();
	const [checked, setChecked] = React.useState(false);

	const handleChange = () => {
		setChecked((prev) => !prev);
	};

	// changes 2021/5/4 to 2021-5-4
	const dashedDate = (date) => {
		return moment(new Date(date).toISOString()).format("YYYY-MM-DD");
	};

	useEffect(async () => {
		// when date changes, set current daily food state to empty
		setIsFoodStateLoading(true);
		setChecked(true);

		// fetch food data for current date if user id is stored in userState
		if (!props.isUserLoading) {
			getDailyFoodInfoByAPIMethod(
				props.userState._id,
				dashedDate(dateState),
				(response) => {
					if (response) {
						setFoodStateByDate(response);
						setIsFoodStateLoading(false);
					}
				}
			);
		}
	}, [dateState, props.isUserLoading]);

	return (
		<div>
			<Nav
				userState={props.userState}
				loginState={props.loginState}
				loginStateFunction={props.loginStateFunction}
			/>
			<div id="body-items">
				<Calendar
					dateState={dateState}
					setDateState={setDateState}
					flipHandler={flipHandler}
					foodStateByDate={foodStateByDate}
					setFoodStateByDate={setFoodStateByDate}
					userState={props.userState}
					setUserState={props.setUserState}
					isUserLoading={props.isUserLoading}
					setIsUserLoading={props.setIsUserLoading}
					setIsFoodStateLoading={setIsFoodStateLoading}
					setChecked={setChecked}
				/>
				{props.isUserLoading || isFoodStateLoading ? (
					<LoadingCard />
				) : (
					<AutoCompleteCalorieSearch
						flipHandler={flipHandler}
						dateState={dateState}
						foodStateByDate={foodStateByDate}
						setFoodStateByDate={setFoodStateByDate}
						userState={props.userState}
					/>
				)}
			</div>
		</div>
	);
};

export default LogCalories;
