const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { createAccessToken, createRefreshToken } = require("../utils/token.js");
const oAuth2Client = require("../config/oauth2Client.js");

const googleLogin = async (req, res) => {
	try {
		const { tokens } = await oAuth2Client.getToken(req.body.code);
		const data = jwt.decode(tokens.id_token, { complete: true });

		let googleUser = await userModel.findOne({ email: data.payload.email });

		if (!googleUser) {
			googleUser = new userModel({ 
				username: data.payload.name,
				email: data.payload.email,
				image: data.payload.picture
			});

			await googleUser.save();
		}

		const accessToken = createAccessToken(googleUser);
		const refreshToken = createRefreshToken(googleUser);

		const {...user} = googleUser._doc;

		user.accessToken = accessToken;

		res.cookie('jwt', refreshToken, { 
			httpOnly: true,
			maxAge: 7 * 24 * 60 * 60 * 1000,
			sameSite: 'None',
			secure: true
		});
		
		return res.status(200).send({ success: true, message: "Google login successfully", user });

	} catch (error) {
		console.log(error.message);
		return res.status(500).send({  success: false, message: "Error while google login", error });
	}
}

const register = async (req, res) => {
	try {

		const { username, email, password } = req.body;

		if (!username || !email || !password) {
			return res.status(400).send({ success: false, message: "All fields are required!" });
		}

		const existingUser = await userModel.findOne({ email });
		if (existingUser) {
			return res.status(401).send({ success: false, message: "User already exists with this email!" });
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const user = new userModel({ username, email, password: hashedPassword });
		await user.save();

		return res.status(201).send({ success: true, message: "User registered successfully!", user: user });

	} catch (error) {
		return res.status(500).send({ message: "Error in Registration", success: false, error });
	}
};

const login = async (req, res) => {
	try {

		const { email, password: reqPassword } = req.body;
		
		if (!email || !reqPassword) {
			return res.status(400).send({ success: false, message: "All fields are required" });
		}

		const foundUser = await userModel.findOne({ email });
		
		if (!foundUser) {
			return res.status(401).send({ success: false, message: "Email or password is incorrect!" });
		}
		
		const isMatch = await bcrypt.compare(reqPassword, foundUser.password);
		
		if (!isMatch) {
			return res.status(401).send({ success: false, message: "Email or password is incorrect!" });
		}

		const accessToken = createAccessToken(foundUser);
		const refreshToken = createRefreshToken(foundUser);

		const {password: dbPassword, ...user } = foundUser._doc;

		user.accessToken = accessToken;
		
		res.cookie('jwt', refreshToken, {
			httpOnly: true,
			maxAge: 2 * 24 * 60 * 60 * 1000,
			sameSite: 'None',
			secure: true
		});
		
		return res.status(200).send({ success: true, message: "Login successfully", user });
	
	} catch (error) {
		console.log(error.message);
		return res.status(500).send({ message: "Error in Login", success: false, error: error });
	}
};

const refresh = (req, res) => {

    const cookies = req?.cookies;

    if (!cookies?.jwt) return res.status(401).json({ success: false, message: 'Unauthorized: No refresh token' });

    const refreshToken = cookies.jwt;

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
			try {
				if (err) return res.status(403).json({ message: 'Invalid refresh token' });

				const foundUser = await userModel.findOne({ email: decoded.UserInfo.email }).exec();

				if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

				const accessToken = createAccessToken(foundUser);

				const {password, ...user } = foundUser._doc;

				user.accessToken = accessToken;

				return res.status(200).send({ success: true, message: "New access token generated", user });

			} catch (error) {
				console.log(error.message);
				return res.status(403).json({success: false, message: error.message || 'An error occurred' });
		  	}
        }
    )
}

const logout = (req, res) => {

    const cookies = req.cookies;

    if (!cookies?.jwt) return res.status(204).send({ success: false, message: "No content" });

    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })

    return res.status(200).send({ success: true, message: 'Logout successfull' })
}

module.exports = { googleLogin, register, login, refresh, logout };