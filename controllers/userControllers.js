const documentModel = require("../models/documentModel");
const emailAccessModel = require("../models/emailAccessModel");

const getAllDocs = async (req, res) => {
	try {

		const userId = req.params.id;

		const ownedDocuments = await documentModel.find({ owner_id: userId });

		// const sharedDocuments = await emailAccessModel.find({ });

		if (!ownedDocuments) {
			
			return res.status(404).send({ success: false, message: "No user documents found" });
		}

		return res.status(200).send({ success: true, message: "User documents get", ownedDocuments });
	
	} catch (error) {
		console.log(error.message);
		return res.status(400).send({ success: false, message: "Error while getting user documents" });
	}
}

module.exports = { getAllDocs };