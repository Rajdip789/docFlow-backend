const bcrypt = require("bcrypt");
const decodeToken = require("../utils/decodeToken");
const userModel = require("../models/userModel.js");
const documentModel = require("../models/documentModel");

const getAllDocs = async (req, res) => {
	try {
		const user = decodeToken(req);

		const ownedDocuments = await documentModel.find({ owner_id: user.userId }, { content: 0, email_access: 0, link_access: 0 });
		const sharedDocuments = await documentModel.find({ 'email_access.email': user.email }, { content: 0, email_access: 0, link_access: 0 });

		const allDocuments = ownedDocuments.concat(sharedDocuments);

		if (!ownedDocuments && !sharedDocuments) {
			return res.status(404).send({ success: false, message: "No user documents found" });
		}

		return res.status(200).send({ success: true, message: "User documents get", allDocuments });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while getting user documents" });
	}
};

const updateAccountController = async (req, res) => {
	try {
		const { id } = req.params;
		const { username, email, image, password } = req.body;

		const user = await userModel.findById(id);

		const hashedPassword = password ? await bcrypt.hash(password, 10) : undefined;
		const updatedUser = await userModel.findByIdAndUpdate(
			id,
			{
				username: username || user.username,
				password: hashedPassword || user.password,
				email: email || user.email,
				image: image || user.image,
			},
			{ new: true }
		);

		res.status(200).send({ success: true, message: "Profile updated successfully", updatedUser });

	} catch (error) {
		res.status(400).send({ success: false, message: "Error while updating profile", error });
	}
};

const deleteAccountController = async (req, res) => {
	try {
		const userId = req.params.id;
		
		await userModel.findByIdAndDelete(userId);
		await documentModel.deleteMany({ owner_id: userId });

		return res.status(200).send({ success: true, message: "Account deleted" });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while deleting account", error });
	}
};

module.exports = { getAllDocs, updateAccountController, deleteAccountController };
