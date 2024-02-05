const socketio = require("socket.io");
const ObjectId = require('mongodb').ObjectId;
const { corsSocketio } = require("./config/corsConfig");
const documentModel = require("./models/documentModel");

async function findOrCreateDocument(documentId, userId, data) {
	const isValidObjectId = ObjectId.isValid(documentId);

	if (isValidObjectId) {
		const document =  await documentModel.findOne(new ObjectId(documentId));
		if(document) return document;
	} else {
		const newDocument = new documentModel({ 
			owner_id: userId, 
			content: data
		});
		return await newDocument.save();
	}
}

const setupSocketIO = (server) => {
	const io = socketio(server, { cors: corsSocketio }).of('/api/v1');

	io.on('connection', (socket) => {
		console.log("Socket connected " + socket.id);

		socket.on('get-document', async (documentId, userId, data) => {
			const document = await findOrCreateDocument(documentId, userId, data);
			socket.emit('load-document', document.content);

			socket.on("save-document", async content => {
				await documentModel.findByIdAndUpdate(documentId, { content });
			})
		});
	});
}

module.exports = setupSocketIO;
