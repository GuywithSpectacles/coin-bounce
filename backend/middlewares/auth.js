const User = require("../models/user");
const UserDTO = require("../dto/user");
const JWTService = require("../services/JWTService");

const auth = async (req, res, next) => {
// 1. validation of both the tokens, access and refresh

    const {refreshToken, accessToken} = req.cookies;

    if(!refreshToken || !accessToken) {
        const error = {
            status: 401,
            message: 'Unauthorized'
        }

        return next(error)
    };

    let _id;

    try{
        _id = JWTService.verifyAccessToken(accessToken);
    }
    catch(error) {
        return next(error)
    }

    let user;
    

    try{
        user = await User.findOne({_id: _id});
    }
    catch(error) {
        return next(error);
    }

    const userDTO = new UserDTO(user);

    req.user = userDTO;

    next();
}

module.exports = auth;