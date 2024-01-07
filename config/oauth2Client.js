const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client(
	process.env.GOOGLE_CLIENT_ID,
	process.env.GOOGLE_CLIENT_SECRET,
	'postmessage',
);

module.exports = oAuth2Client