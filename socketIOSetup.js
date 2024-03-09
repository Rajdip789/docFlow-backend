const socketio = require("socket.io");
const { corsSocketio } = require("./config/corsConfig");
const documentModel = require("./models/documentModel");

const setupSocketIO = (server) => {
	const io = socketio(server, { cors: corsSocketio }).of('/api/v1');

	io.on('connection', (socket) => {
		console.log("Socket connected " + socket.id);

		socket.on("save-document", async (docId, content) => {
			try {
				await documentModel.findByIdAndUpdate(docId, { content });
			} catch (error) {
				console.log(error);
			}
		})
	});
}

module.exports = setupSocketIO;
