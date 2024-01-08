const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require('../config/index');
const RefreshToken = require('../models/token');

class JWTService{
    //Making these methods/functions static so that we don't create new objects everytime we call them.

    // Sign Access Token
    static signAccessToken(payload, expiryTime) {
        return jwt.sign(payload, ACCESS_TOKEN_SECRET, {expiresIn: expiryTime})
    }

    // Sign Refresh Token
    static signRefreshToken(payload, expiryTime) {
        return jwt.sign(payload, REFRESH_TOKEN_SECRET, {expiresIn: expiryTime})
    }
    
    // Verify Access Token
    static verifyAccessToken(token) {
        return jwt.verify(token, ACCESS_TOKEN_SECRET);
    }

    // Verify Refresh Token
    static verifyRefreshToken(token) {
        return jwt.verify(token, REFRESH_TOKEN_SECRET);
    }

    // Store Refresh token
    static async storeRefreshToken(token, userID) {
        try{
            const newToken = new RefreshToken({
                token,
                userID
            });

            // store in DB
            await newToken.save();
        }
        catch(err) {
            throw new Error(err);
        }
    }
}

module.exports = JWTService;