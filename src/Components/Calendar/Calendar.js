import React, { useEffect } from "react";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import moment from "moment";
import { getDailyFoodInfoByAPIMethod } from "../../api/client.js";

const Calendar = (props) => {
	// Increases the date by 1 on right arrow click
	const increaseDate = (e) => {
		let date = new Date(props.dateState);
		date.setDate(date.getDate() + 1);
		let currDate = new Date();
		let newDate =
			date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();
		if (date <= currDate) {
			props.setDateState(newDate);
		}
	};

	// Decreases the date by 1 on left arrow click
	const decreaseDate = (e) => {
		let date = new Date(props.dateState);
		date.setDate(date.getDate() - 1);
		let newDate =
			date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear();

		props.setDateState(newDate);
	};

	// changes 2021/5/4 to 2021-5-4
	const dashedDate = (date) => {
		return moment(new Date(date).toISOString()).format("YYYY-MM-DD");
	};

	// useEffect(async () => {
	// 	// when date changes, set current daily food state to empty
	// 	props.setIsFoodStateLoading(true);
	// 	props.setChecked(true);

	// 	// fetch food data for current date if user id is stored in userState
	// 	if (!props.isUserLoading) {
	// 		getDailyFoodInfoByAPIMethod(
	// 			props.userState._id,
	// 			dashedDate(props.dateState),
	// 			(response) => {
	// 				if (response) {
	// 					props.setFoodStateByDate(response);
	// 					props.setIsFoodStateLoading(false);
	// 				}
	// 			}
	// 		);
	// 	}
	// }, [props.dateState, props.isUserLoading]);
	return (
		<div id="calendar">
			<div onClick={decreaseDate}>
				<ArrowBackIosIcon id="date-before" />
			</div>
			<div>
				<h2>{props.dateState}</h2>
			</div>
			<div onClick={increaseDate}>
				<ArrowForwardIosIcon id="date-after" />
			</div>
		</div>
	);
};

export default Calendar;
