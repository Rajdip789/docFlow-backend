const jwt = require("jsonwebtoken");

const createAccessToken = (user) => {
	return jwt.sign(
		{
			"UserInfo": {
				"userId": user._id,
				"email": user.email
			}
		},
		process.env.ACCESS_TOKEN_SECRET,
		{ expiresIn: process.env.ACCESS_TOKEN_EXPIRE }
	);
}

const createRefreshToken = (user) => {
	return jwt.sign(
		{
			"UserInfo": {
				"userId": user._id,
				"email": user.email
			}
		},
		process.env.REFRESH_TOKEN_SECRET,
		{ expiresIn: process.env.REFRESH_TOKEN_EXPIRE }
	);
}

module.exports = { createAccessToken, createRefreshToken };