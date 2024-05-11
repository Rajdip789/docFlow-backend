const decodeToken = require("../utils/decodeToken");
const userModel = require("../models/userModel.js");
const documentModel = require("../models/documentModel");
const cloudinary = require('../config/cloudinaryConfig');
const streamifier = require('streamifier');

const get_public_id = (imageUrl) => {
	let startIndex = imageUrl.lastIndexOf('/') + 1;
	let endIndex = imageUrl.lastIndexOf('.');

	return imageUrl.slice(startIndex, endIndex);
}

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
		const { username, email } = req.body;

		let updatedUser = await userModel.findByIdAndUpdate(
			id,
			{
				username: username,
				email: email,
			},
			{ new: true }
		);

		if(req.file !== undefined) {

			const user = await userModel.findById(id);

			if(user.image.startsWith('https://res.cloudinary.com/dpcqknniq')) {
				const public_id = "docflow-user/" + get_public_id(user.image);
				await cloudinary.uploader.destroy(public_id);	
			}

			const cld_upload_stream = cloudinary.uploader.upload_stream({  
				folder: 'docflow-user'
			}, async function(error, result) {

				if(error) {
					throw new Error("Upload failed");
				}

				updatedUser = await userModel.findByIdAndUpdate(
					id, {
						$set: {
							image: result.secure_url
						}
					}
				);
			});

			streamifier.createReadStream(req.file.buffer).pipe(cld_upload_stream);
		}

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
