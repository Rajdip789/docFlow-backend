const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
	{
		user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		message: { type: String, required: true },
		status: { type: Boolean, default: true },
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Notification", NotificationSchema);