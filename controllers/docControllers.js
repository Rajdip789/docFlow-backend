const userModel = require("../models/userModel.js");
const documentModel = require("../models/documentModel");

const getDocInfoController = async (req, res) => {
	try {
		const docs = await documentModel.findById(req.params.id, { _id: 0, email_access: 1, link_access: 1, title: 1 });
		const users = await userModel.find({}, { _id: 0, email: 1, username: 1 });

		return res.status(201).send({ success: true, message: "Document info fetched", docs, users });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while fetching document", error });
	}
};

const addEmailAccess = async (req, res) => {
	try {
		const { DocId, shareEmail } = req.body;
		const data = await documentModel.updateOne({ _id: DocId }, { $push: { email_access: { $each: shareEmail } } });

		return res.status(201).send({ success: true, message: "Email aceess added successfully", data });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while giving access", error });
	}
};

const updateEmailAccess = async (req, res) => {
	try {
		const { DocId, updatedAccessData } = req.body;

		await documentModel.updateOne({ _id: DocId }, { $set: { 'email_access': updatedAccessData } });

		return res.status(201).send({ success: true, message: "Email aceess updated successfully" });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while updating email access", error });
	}
};

const addLinkAccess = async (req, res) => {
	try {
		const { DocId, linkShare, linkShareType } = req.body;

		await documentModel.updateOne({ _id: DocId }, { $set: { 'link_access.is_active': linkShare, 'link_access.access_type': linkShareType } });

		return res.status(201).send({ success: true, message: "Link access configured successfully" });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while configuring link access", error });
	}
};

const createDocController = async (req, res) => {
	try {
		const { content, title } = req.body;

		const newDoc = new documentModel({ content, title });
		await newDoc.save();

		return res.status(201).send({ success: true, message: "Document created", newDoc });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error al crear el documento", error });
	}
};

const renameDocController = async (req, res) => {
	try {
		const { id } = req.params;

		const doc = await documentModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

		return res.status(200).send({ success: true, message: "Document name updated", doc });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while updating document", error });
	}
};

const deleteDocController = async (req, res) => {
	try {
		await documentModel.findByIdAndDelete(req.params.id);

		return res.status(200).send({ success: true, message: "Document deleted" });

	} catch (error) {
		return res.status(400).send({ success: false, message: "Error while deleting document", error });
	}
};

module.exports = {
	createDocController,
	deleteDocController,
	renameDocController,
	getDocInfoController,
	addEmailAccess,
	updateEmailAccess,
	addLinkAccess
};
