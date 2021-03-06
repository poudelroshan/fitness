import React, { useState, useRef, useEffect } from "react";
import {
	getNutritionInfoByFoodAPIMethod,
	getAutoCompleteByFoodAPIMethod,
	getRestaurantMenuByAPIMethod,
	getPhotoFromUnsplashAPIMethod,
	addToDailyFoodAPIMethod,
} from "../../api/client.js";
import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import _ from "lodash";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import FoodCard from "./FoodCard";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
const AutoCompleteCalorieSearch = (props) => {
	// changes 2021/5/4 to 2021-5-4
	const dashedDate = (date) => {
		return moment(new Date(date).toISOString()).format("YYYY-MM-DD");
	};

	// Gets nutrition info from the db and returns the list
	const getNutritionInfo = () => {
		let nutritionList = [0, 0, 0, 0]; // ["Fat", "Fiber", "Protein", "Carbohydrates"]
		if (JSON.stringify(props.foodStateByDate) !== "{}") {
			props.foodStateByDate.foodIntake.map((food) => {
				nutritionList[0] += food.nutrients.FAT;
				nutritionList[1] += food.nutrients.FIBR;
				nutritionList[2] += food.nutrients.PRTN;
				nutritionList[3] += food.nutrients.CARBS;
			});

			nutritionList[0] = (nutritionList[0] / 30) * 100;
			nutritionList[1] = (nutritionList[1] / 20) * 100;
			nutritionList[2] = (nutritionList[2] / 50) * 100;
			nutritionList[3] = (nutritionList[3] / 300) * 100;
		}

		return nutritionList;
	};
	// food state
	const [newFoodState, setNewFoodState] = useState("");
	const [options, setOptions] = useState([]);
	const [open, setOpen] = React.useState(false);
	const loading = open && options.length === 0;
	const [foodToAdd, setFoodToAdd] = useState("");

	const [series, setSeries] = useState(getNutritionInfo());

	const [chartOptions, setChartOptions] = useState({
		chart: {
			height: 350,
			type: "radialBar",
		},
		plotOptions: {
			radialBar: {
				dataLabels: {
					name: {
						fontSize: "42px",
					},
					value: {
						fontSize: "16px",
					},
					total: {
						show: true,
						label: "Food Requirements",
						formatter: function (w) {
							// By default this function returns the average of all series. The below is just an example to show the use of custom formatter function
							if (
								series[0] >= 100 &&
								series[1] >= 100 &&
								series[2] >= 100 &&
								series[3] >= 100
							)
								return "complete";
							else return "incomplete";
						},
					},
				},
			},
		},
		labels: ["Fat", "Fiber", "Protein", "Carbohydrates"],
	});

	const formSubmitHandler = (event, newFoodToAdd) => {
		event.preventDefault();
		if (newFoodToAdd && newFoodToAdd !== "") {
			getNutritionInfoByFoodAPIMethod(newFoodToAdd, (response) => {
				getPhotoFromUnsplashAPIMethod(newFoodToAdd, (response2) => {
					response.hints[0].label = newFoodToAdd;
					response.parsed[0].label = newFoodToAdd;

					if (response.parsed[0]) {
						response.parsed[0].label = newFoodToAdd;
						response.parsed[0].image = response2.results[0].links.download;
						console.log("reponse to save");
						console.log(response.parsed[0]);
						setNewFoodState(response.parsed[0]);
					} else {
						response.hints[0].label = newFoodToAdd;
						response.hints[0].image = response2.results[0].links.download;
						setNewFoodState(response.hints[0]);
						console.log("reponse to save");
						console.log(response.hints[0]);
					}
				});
			});
		}
	};

	const foodTypingHandler = (event) => {
		event.preventDefault();
		setFoodToAdd(event.target.value);
	};
	const fiterFoodNames = (responseObj) => {
		const foodList = [];
		responseObj.hints.forEach((foodObj) => foodList.push(foodObj.food.label));
		return foodList;
	};

	const removeDuplicatesInList = (list) => {
		let s = new Set(list);
		let it = s.values();
		return Array.from(it);
	};

	const findAutoCompleteSearches = (searchText) => {
		// calling autocomplete api
		let autocompleteArr = [];
		getAutoCompleteByFoodAPIMethod(searchText, (response) => {
			autocompleteArr = response;

			// getting autocomplete suggestions from restaurants nearby user location (zip)
			getRestaurantMenuByAPIMethod(
				searchText,
				props.userState.address.zip,
				(response) => {
					let restaurantMenus = fiterFoodNames({ ...response });
					let newList = removeDuplicatesInList(
						autocompleteArr.concat(restaurantMenus)
					);
					setOptions(newList);
				}
			);
		});
	};
	// Debounce the calls to a max of 1 per second
	const debouncedAutoCompleteSearch = useRef(
		_.debounce((searchTerm) => findAutoCompleteSearches(searchTerm), 1000)
	).current;

	useEffect(() => {
		if (!open) {
			setOptions([]);
		}
	}, [open]);

	useEffect(() => {
		if (foodToAdd !== "") {
			debouncedAutoCompleteSearch(foodToAdd);
		}
	}, [foodToAdd]);

	useEffect(() => {
		setSeries(getNutritionInfo());
		if (JSON.stringify(props.foodStateByDate) !== "{}") {
			addToDailyFoodAPIMethod(props.foodStateByDate, (response) => {
				console.log("updated daily food to db");
			});
		}
	}, [props.foodStateByDate]);

	const foodArrayContainsNewFoodObj = (foodArr, newObj) => {
		for (let i = 0; i < foodArr.length; i++) {
			if (foodArr[i].foodName === newObj.foodName) return true;
		}
		return false;
	};

	// when new food is added, add it to current daily food state
	useEffect(() => {
		if (newFoodState !== "") {
			const currFoodState = { ...props.foodStateByDate };

			const newFoodObj = {
				foodName: newFoodState.label || "",
				image: newFoodState.image,
				calories: newFoodState.food.nutrients.ENERC_KCAL || 0,
				nutrients: {
					CARBS: newFoodState.food.nutrients.CHOCDF || 0,
					PRTN: newFoodState.food.nutrients.PROCNT || 0,
					FIBR: newFoodState.food.nutrients.FIBTG || 0,
					FAT: newFoodState.food.nutrients.FAT || 0,
				},
			};
			if (
				currFoodState.foodIntake &&
				foodArrayContainsNewFoodObj(currFoodState.foodIntake, newFoodObj)
			) {
				// show a notification that new food cannot be added
				alert(
					"Current Food is already present in db for today" +
						newFoodObj.foodName
				);
			} else {
				if (currFoodState.foodIntake) currFoodState.foodIntake.push(newFoodObj);
				else {
					currFoodState.user = props.userState._id;
					currFoodState.date = dashedDate(props.dateState);
					currFoodState.foodIntake = [newFoodObj];
				}
			}
			props.setFoodStateByDate(currFoodState);
		}
	}, [newFoodState]);
	return (
		<div>
			<Card
				style={{
					backgroundColor: "#fffff",
					width: "95vw",
					height: "fit-content",
					padding: "10px",
				}}
				className="calorieCard"
			>
				<CardContent>
					<div>
						<ReactApexChart
							options={chartOptions}
							series={series}
							type="radialBar"
							height={350}
						/>
						<Typography gutterBottom variant="h6" style={{}}>
							Add new Food item for today:
						</Typography>
						<form onSubmit={formSubmitHandler}>
							<div>
								<Autocomplete
									id="asynchronous-demo"
									style={{ width: 300 }}
									open={open}
									onOpen={() => {
										setOpen(true);
									}}
									onClose={() => {
										setOpen(false);
									}}
									// getOptionSelected={(option, value) => option === value}
									getOptionSelected={(option) => option}
									getOptionLabel={(option) => option}
									options={options}
									loading={loading}
									onChange={(event, newValue) => {
										setFoodToAdd("");
										formSubmitHandler(event, newValue);
									}}
									value={foodToAdd}
									renderInput={(params) => (
										<TextField
											{...params}
											id="standard-full-width"
											label="Food name"
											style={{}}
											placeholder="What did you eat today?"
											helperText=""
											fullWidth
											margin="normal"
											value={foodToAdd}
											onChange={foodTypingHandler}
											InputProps={{
												...params.InputProps,
												endAdornment: (
													<React.Fragment>
														{loading ? (
															<CircularProgress color="inherit" size={20} />
														) : null}
														{params.InputendAdornment}
													</React.Fragment>
												),
											}}
										/>
									)}
								/>
							</div>
						</form>
					</div>
					<br />
					<br />
					<Divider light />

					<div id="form-section">
						<div>
							<Typography
								gutterBottom
								variant="h6"
								style={{ marginTop: "30px" }}
							>
								Food Items in Database for today:
							</Typography>

							{JSON.stringify(props.foodStateByDate) !== "{}" ? (
								<div className="foodRow">
									{props.foodStateByDate.foodIntake.map((food, index) => {
										return (
											<div className="foodItem" key={index}>
												<FoodCard
													food={food}
													foodStateByDate={props.foodStateByDate}
													setFoodStateByDate={props.setFoodStateByDate}
												/>
											</div>
										);
									})}
								</div>
							) : (
								"Nothing available"
							)}
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

export default AutoCompleteCalorieSearch;
