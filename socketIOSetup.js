const socketio = require("socket.io");
const { corsSocketio } = require("./config/corsConfig");
const documentModel = require("./models/documentModel");
const { subClient, pubClient } = require("./config/redis");

const setupSocketIO = (server) => {
	const io = socketio(server, { cors: corsSocketio }).of('/api/v1');

	subClient.subscribe("document-changes");

	subClient.on("message", (channel, message) => {
		if(channel == "document-changes") {
			const { senderId, documentId, delta } = JSON.parse(message);
			io.to(documentId).emit("receive-changes", { delta, senderId });
		}
	})

	io.on('connection', (socket) => {
		socket.on("ready", async documentId => {
			socket.join(documentId);
			console.log("Socket: ", socket.id)

			socket.on("send-changes", (delta) => {
				pubClient.publish(
                    "document-changes",
                    JSON.stringify({ senderId: socket.id, documentId, delta })
                );
			})

			socket.on("save-document", async (docId, content) => {
				try {
					await documentModel.findByIdAndUpdate(docId, { content });
					socket.emit('save-document-success');
				} catch (error) {
					console.log(error);
					socket.emit('save-document-failure');
				}
			})
		});
	});
}

module.exports = setupSocketIO;
