const corsOption = {
	origin: ["http://localhost:5173"],
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	credentials: true,
	optionsSuccessStatus: 200,
};

const corsSocketio = {
	origin: ["http://localhost:5173"],
	methods: ["GET", "POST"]
}

module.exports = { corsOption, corsSocketio };