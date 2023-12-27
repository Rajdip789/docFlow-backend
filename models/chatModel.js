const mongoose = require("mongoose");

const ChatSchema = new mongoose.Schema(
	{
		messages: [
			{
				user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
				username: { type: String, required: true, unique: true },
				msg: { type: String, required: true },
				createdAt: { type: Date, default: Date.now, required: true }
			}
		],
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Chat", ChatSchema);

