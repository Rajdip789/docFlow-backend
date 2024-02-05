const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
	{
		content: { type: Object, default: {} },
		title: { type: String, default: "Untitled Doc" },
		owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		mail_access_id: { type: mongoose.Schema.Types.ObjectId, ref: 'EmailAccess' },
		chat_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Chat' },
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Document", DocumentSchema);