const jwt = require('jsonwebtoken');

module.exports = (req) => {
	const authHeader = req.headers.authorization || req.headers.Authorization
    const token = authHeader.split(' ')[1];

    const data = jwt.decode(token, { complete: true });
    
	return data.payload.UserInfo;
}