require("dotenv").config();

const corsOption = {
	origin: [process.env.CROSS_ORIGIN_URL],
	methods: ['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
	credentials: true,
	optionsSuccessStatus: 200,
};

const corsSocketio = {
	origin: [process.env.CROSS_ORIGIN_URL],
	methods: ["GET", "POST"]
}

module.exports = { corsOption, corsSocketio };