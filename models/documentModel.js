const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema(
	{
		_id: { type: mongoose.Schema.Types.ObjectId, required: true },
		content: { type: Object, default: {} },
		title: { type: String, default: "Untitled Doc" },
		owner_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		email_access: [
			{
			  email: { type: String, required: true },
			  name: { type: String, required: true },
			  type: { type: String, enum: ['view', 'edit'], required: true }
			}
		],
		link_access: {
			is_active: { type: Boolean, default: false },
			access_type: { type: String, enum: ['view', 'edit'], default: 'view' },
			link: { type: String, required: true }
		}
	},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("Document", DocumentSchema);