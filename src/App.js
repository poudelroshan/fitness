import "./App.css";

import React, { useState, useEffect } from "react";
import Questions from "./Components/Workout/Questions";
import { Route, Switch } from "react-router-dom";
import Data from "./Components/Data";
import Profile from "./Components/Profile/Profile";
import {
	isLoggedIn,
	loginAlert,
	isAdmin,
	adminAlert,
} from "./util/googleLogin";
import Main from "./Components/Main";
import LogCalories from "./Components/Calories/LogCalories";
import { getUserStateByEmailAPIMethod } from "./api/client.js";
import Getstart from "./Components/Profile/Getstart";
import AdminPage from "./Components/Admin/adminPage";
import ViewData from "./Components/ViewData/ViewData";

function App() {
	//question
	const [questionState, setQuestionState] = useState([]);
	//??
	const [isDataState, setIsDataStale] = useState(false);
	//userData
	const [userState, setUserState] = useState(
		isLoggedIn() ? JSON.parse(sessionStorage.getItem("userData")) : ""
	);

	//loginStatus
	const [loginState, setLoginState] = useState(false);
	// is the user information fetched from db ?
	const [isUserLoading, setIsUserLoading] = useState(true);

	useEffect(async () => {
		if (isLoggedIn()) {
			await getUserStateByEmailAPIMethod(
				JSON.parse(sessionStorage.getItem("userData")).email,
				(response) => {
					if (response !== null) {
						setUserState(response);
						setLoginState(true);
					}
				}
			);
		}
	}, []);

	useEffect(() => {
		if (userState && userState._id) {
			setIsUserLoading(false);
			sessionStorage.removeItem("userData");
			sessionStorage.setItem("userData", JSON.stringify(userState));
		}
	}, [userState]);

	//loginStatus function
	const setLoginStateFunction = (state) => {
		setLoginState(state);
	};

	return (
		<div className="App">
			<Switch>
				<Route
					path="/"
					exact
					render={(props) => (
						<Main
							{...props}
							loginState={loginState}
							loginStateFunction={setLoginStateFunction}
						/>
					)}
				/>
				<Route
					path="/calories"
					exact
					render={(props) => (
						<LogCalories
							{...props}
							userState={userState}
							loginState={loginState}
							loginStateFunction={setLoginStateFunction}
							setUserState={setUserState}
							isUserLoading={isUserLoading}
							setIsUserLoading={setIsUserLoading}
						/>
					)}
				/>
				<Route
					path="/questions"
					exact
					render={(props) =>
						isLoggedIn() ? (
							<Questions
								{...props}
								loginState={loginState}
								loginStateFunction={setLoginStateFunction}
								questionState={questionState}
								setQuestionState={setQuestionState}
								isDataState={isDataState}
								setIsDataStale={setIsDataStale}
								userState={userState}
								setUserState={setUserState}
							/>
						) : (
							loginAlert()
						)
					}
				/>

				<Route
					path="/profile"
					exact
					render={(props) =>
						isLoggedIn() ? (
							<Profile
								{...props}
								loginState={loginState}
								loginStateFunction={setLoginStateFunction}
								userState={userState}
								setUserState={setUserState}
								isDataState={isDataState}
								setIsDataStale={setIsDataStale}
								isUserLoading={isUserLoading}
								setIsUserLoading={setIsUserLoading}
							/>
						) : (
							loginAlert()
						)
					}
				/>
				<Route
					path="/getStarted"
					render={(props) =>
						isLoggedIn() ? (
							<Getstart
								{...props}
								loginState={loginState}
								loginStateFunction={setLoginStateFunction}
								userState={userState}
								setUserState={setUserState}
								isDataState={isDataState}
								setIsDataStale={setIsDataStale}
								isUserLoading={isUserLoading}
								setIsUserLoading={setIsUserLoading}
							/>
						) : (
							loginAlert()
						)
					}
				/>

				<Route
					path="/viewdata"
					render={(props) =>
						isLoggedIn() ? (
							<ViewData
								{...props}
								loginState={loginState}
								loginStateFunction={setLoginStateFunction}
								userState={userState}
								setUserState={setUserState}
								isDataState={isDataState}
								setIsDataStale={setIsDataStale}
								isUserLoading={isUserLoading}
								setIsUserLoading={setIsUserLoading}
							/>
						) : (
							loginAlert()
						)
					}
				/>
				<Route
					path="/admin"
					render={(props) =>
						isAdmin() ? (
							<AdminPage
								{...props}
								loginState={loginState}
								loginStateFunction={setLoginStateFunction}
								userState={userState}
								setUserState={setUserState}
								isDataState={isDataState}
								setIsDataStale={setIsDataStale}
								isUserLoading={isUserLoading}
								setIsUserLoading={setIsUserLoading}
							/>
						) : (
							adminAlert()
						)
					}
				/>
			</Switch>
		</div>
	);
}

export default App;
