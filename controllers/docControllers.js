const mongoose = require("mongoose");
const ObjectId = require('mongodb').ObjectId;
const decodeToken = require("../utils/decodeToken");
const userModel = require("../models/userModel.js");
const documentModel = require("../models/documentModel");

const generateShareLink = (documentId) =>
	`${process.env.CROSS_ORIGIN_URL}/share/${documentId}`;

const getDocInfoController = async (req, res) => {
	try {
		const docs = await documentModel.aggregate([
			{
				$match: { _id: new mongoose.mongo.ObjectId(req.params.id) }
			},
			{
				$lookup: { 
					from: "users",
					localField: "owner_id",
					foreignField: "_id",
					as: "owner"
				}
			},
			{
				$unwind: "$owner"
			},
			{
				$project: { _id: 0, email_access: 1, link_access: 1, title: 1, owner_id: 1, owner: 1 }
			}
		]);
		
		const users = await userModel.find({}, { _id: 0, email: 1, username: 1 });

		return res.status(200).send({ success: true, message: "Document info fetched", docs: docs[0], users });

	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, message: "Error while fetching document", error });
	}
};

const getDocContent = async (req, res) => {
	try {
		const user = decodeToken(req);
		const docId = req.params.id;

		const isValidObjectId = ObjectId.isValid(docId);																																								

		if(!isValidObjectId) {
			return res.status(400).send({ success: false, message: "Invalid data" });
		} 

		const doc = await documentModel.findById(docId);

		const isOwner = doc.owner_id.toString() === user.userId;
		const emailExists = doc.email_access.find(({ email }) => email === user.email) !== undefined;

		if(!isOwner && !emailExists) {
			return res.status(403).send({ success: false, message: "User have not sufficient privileges" });
		}

		return res.status(200).send({ success: true, message: "Document content fetched", doc });

	} catch (error) {
		console.log(error);
		return res.status(500).send({ success: false, message: "Error while geting document", error });
	}
};

const addEmailAccess = async (req, res) => {
	try {
		const { DocId, shareEmail } = req.body;
		const data = await documentModel.updateOne({ _id: DocId }, { $push: { email_access: { $each: shareEmail } } });

		return res.status(201).send({ success: true, message: "Email aceess added successfully", data });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while giving access", error });
	}
};

const updateEmailAccess = async (req, res) => {
	try {
		const { DocId, updatedAccessData } = req.body;

		await documentModel.updateOne({ _id: DocId }, { $set: { 'email_access': updatedAccessData } });

		return res.status(201).send({ success: true, message: "Email aceess updated successfully" });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while updating email access", error });
	}
};

const addLinkAccess = async (req, res) => {
	try {
		const { DocId, linkShare, linkShareType } = req.body;

		await documentModel.updateOne({ _id: DocId }, { $set: { 'link_access.is_active': linkShare, 'link_access.access_type': linkShareType } });

		return res.status(201).send({ success: true, message: "Link access configured successfully" });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while configuring link access", error });
	}
};

const createDocController = async (req, res) => {
	try {
		const { userId } = req.body;
		const newId = new mongoose.mongo.ObjectId();

		const newDoc = new documentModel({
			_id: newId,
			owner_id: userId,
			link_access: { link: generateShareLink(newId) }
		});

		await newDoc.save();

		return res.status(201).send({ success: true, message: "Document created", newDoc });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while creating  document", error });
	}
};

const renameDocController = async (req, res) => {
	try {
		const { id } = req.params;

		const doc = await documentModel.findByIdAndUpdate(id, { ...req.body }, { new: true });

		return res.status(200).send({ success: true, message: "Document name updated", doc });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while updating document", error });
	}
};

const deleteDocController = async (req, res) => {
	try {
		await documentModel.findByIdAndDelete(req.params.id);

		return res.status(200).send({ success: true, message: "Document deleted" });

	} catch (error) {
		return res.status(500).send({ success: false, message: "Error while deleting document", error });
	}
};

module.exports = {
	createDocController,
	deleteDocController,
	renameDocController,
	getDocInfoController,
	getDocContent,
	addEmailAccess,
	updateEmailAccess,
	addLinkAccess
};
