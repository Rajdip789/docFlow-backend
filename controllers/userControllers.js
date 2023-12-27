const userModel = require("../models/userModel.js");
const bcrypt = require("bcrypt");

const createUser = async (req, res) => {
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
		console.log(error);
		return res.status(500).send({ message: "Error in Registration", success: false, error });
	}
};

module.exports = { createUser };