const corsOption = {
	origin: ["http://localhost:5173"],
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	credentials: true,
	optionsSuccessStatus: 200,
};

module.exports = corsOption;