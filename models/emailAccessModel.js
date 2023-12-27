const mongoose = require("mongoose");

const EmailAccessSchema = new mongoose.Schema(
	{
		permissions: {
			view: { type: [String], default: [] },
			edit: { type: [String], default: [] }
		},
	}
);

module.exports = mongoose.model("EmailAccess", EmailAccessSchema);