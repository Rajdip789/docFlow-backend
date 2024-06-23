const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		doc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
		username: { type: String, required: true },
		msg: { type: String, required: true }
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Comment", CommentSchema);

