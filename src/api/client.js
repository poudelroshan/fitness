const defaultHeaders = {
	headers: {
		"Content-Type": "application/json; charset=UTF-8",
		Accept: "application/json",
	},
};

export const getQuestionsAPIMethod = (success) => {
	return fetch(`/api/v1/question`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const createQuestionAPIMethod = (question, success) => {
	return fetch(`/api/v1/question`, {
		...defaultHeaders,
		method: "POST",
		body: JSON.stringify(question),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const updateQuestionByIdAPIMethod = (question, success) => {
	return fetch(`/api/v1/question/${question._id}`, {
		...defaultHeaders,
		method: "PUT", // The method defaults to GET
		body: JSON.stringify(question),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const deleteQuestionByIdAPIMethod = (questionId, success) => {
	return fetch(`/api/v1/question/${questionId}`, {
		...defaultHeaders,
		method: "DELETE",
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const getResponsesAPIMethod = (success) => {
	return fetch(`/api/v1/response`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
export const getResponseByIdAPIMethod = (questionId, success) => {
	return fetch(`/api/v1/response/${questionId}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const createResponseByIdAPIMethod = (response, success) => {
	return fetch(`/api/v1/response/${response.question}`, {
		...defaultHeaders,
		method: "POST", // The method defaults to GET
		body: JSON.stringify(response),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const uploadImageToCloudinaryAPIMethod = (formData, success) => {
	const cloudName = "roshanpoudel"; // TODO: Write in your own Cloudinary account
	return fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
		// We do NOT want to set the default headers – the formData will automatically set the
		// headers to tell the server of the data type (which is different than the JSON
		// standard all the other API calls have been sending
		method: "POST",
		body: formData,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
const UNSPLASH_ACCESS_KEY = "LOsqdwdgI0TWMgXS2vS8-ChLzScVHYpgn3bmpaTaAtM";

export const getPhotoFromUnsplashAPIMethod = (query, success) => {
	console.log(
		`https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${query}&orientation=landscape&count=1&client_id=${UNSPLASH_ACCESS_KEY}`
	);
	return fetch(
		`https://api.unsplash.com/search/photos/?page=1&per_page=10&query=${query}&orientation=landscape&count=1&client_id=${UNSPLASH_ACCESS_KEY}`
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
export const getUserStateByEmailAPIMethod = (email, success) => {
	return fetch(`/api/user/${email}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
export const deleteUserByEmailAPIMethod = (email,success) =>{
	return fetch(`/api/user/${email}`, {
		...defaultHeaders,
		method: "DELETE", // The method defaults to GET
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const getAllUsersAPIMethod  = (success) =>{
	return fetch(`/api/user`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
}
export const addToDailyFoodAPIMethod = (newFoodObj, success) => {
	return fetch(`/api/food`, {
		...defaultHeaders,
		method: "POST", // The method defaults to GET
		body: JSON.stringify(newFoodObj),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
//update user
export const updateUserByAPIMethod = (user, success) => {
	return fetch(`/api/user`, {
		...defaultHeaders,
		method: "PUT", // The method defaults to GET
		body: JSON.stringify(user),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
//create user
export const createUserByAPIMethod = (user, success) => {
	return fetch(`/api/user`, {
		...defaultHeaders,
		method: "POST", // The method defaults to GET
		body: JSON.stringify(user),
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
// get nutrition info for last 7 days for graphs in view data page
export const last7DaysNutritionAPIMethod = (uid, date, success) => {
	return fetch(`/api/food/last7/${uid}/${date}`, {
		...defaultHeaders,
		method: "GET", // The method defaults to GET
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
export const getDailyFoodInfoByAPIMethod = (uid, date, success) => {
	return fetch(`/api/food/${uid}/${date}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const getNutritionInfoByFoodAPIMethod = (foodName, success) => {
	return fetch(
		`https://api.edamam.com/api/food-database/v2/parser?ingr=${foodName}&app_id=942000ce&app_key=2877d4cdd0895c654f3a65b4ed24ad13`,
		{
			...defaultHeaders,
		}
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const getAutoCompleteByFoodAPIMethod = (searchText, success) => {
	return fetch(
		`https://api.edamam.com/auto-complete?q=${searchText}&limit=15&&app_id=942000ce&app_key=2877d4cdd0895c654f3a65b4ed24ad13`,
		{
			...defaultHeaders,
		}
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};
export const getRestaurantMenuByAPIMethod = (searchText, zip, success) => {
	return fetch(
		`https://api.edamam.com/api/menu-items/v2/search?q=${searchText}&postal=${zip}&dist=10&app_id=942000ce&app_key=2877d4cdd0895c654f3a65b4ed24ad13`,
		{
			...defaultHeaders,
		}
	)
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
};

export const deleteIntakeRecordAPIMethod= (userid,success) =>{
	return fetch(`/api/food/${userid}`, {
		...defaultHeaders,
		method:"DELETE",
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
}
export const deleteWorkoutRecordAPIMethod= (userid,success) =>{
	return fetch(`/api/workout/${userid}`, {
		...defaultHeaders,
		method:"DELETE",
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
}
export const numberOfFoodRecordAPIMethod= (userid,success) =>{
	return fetch(`/api/food/number/${userid}`, {
		...defaultHeaders,
	})
		.then(checkStatus)
		.then(parseJSON)
		.then(success);
}
function checkStatus(response) {
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else {
		const error = new Error(`HTTP Error: ${response.statusText}`);
		error.status = response.statusText;
		error.response = response;
		console.log(error);
		throw error;
	}
}

function parseJSON(response) {
	return response.json();
}
