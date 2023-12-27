const mongoose = require("mongoose");

const LinkAccessSchema = new mongoose.Schema(
	{
		doc_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
		share_link: { type: String },
		permissions: {
			view: { type: Boolean, default: false },
			edit: { type: Boolean, default: false }
		},
	}
);

module.exports = mongoose.model("LinkAccess", LinkAccessSchema);