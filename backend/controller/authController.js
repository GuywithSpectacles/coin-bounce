const Joi = require('joi');
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const userDTO = require('../dto/user');
const JWTService = require('../services/JWTService');
const RefreshToken = require('../models/token');
const UserDTO = require('../dto/user');

const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,25}$/;

const authController = {
    async register(req, res, next) {
        // 1. Validate user input
        const userRegisterSchema = Joi.object({
            name: Joi.string().max(30).required(),
            userName: Joi.string().min(0).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(passwordPattern).required(),
            confirmPassword: Joi.ref('password')
        });
        const {error} = userRegisterSchema.validate(req.body);

        // 2. If error in validation -> return an error via middleware
        if(error) {
            return next(error);
        }

        // 3. If email or username is already registered -> return an error
        const {name, userName, email, password} = req.body;

        try {
            const emailInUse = await User.exists({email});

            const userNameTaken = await User.exists({userName});

            if (emailInUse) {
                const error = {
                    status: 409,
                    message: 'Email already registered, use another email!'
                };

                return next(error);
            }

            if (userNameTaken) {
                const error = {
                    status: 409,
                    message: 'Username already taken, use another username'
                };

                return next(error);
            };
        }
        catch(error) {
            return next(error)
        }

        // 4. Password hash
        const salt = 10
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. store user data in database
        let accessToken;
        let refreshToken;
        let user;

        try{
            const userToRegister = new User({
                name,
                userName,
                email,
                password: hashedPassword
            });
    
            user = await userToRegister.save();

            // token generation
            accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
            refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');
        }
        catch(error) {
            return next(error)
        }

        // store refresh token in db
        await JWTService.storeRefreshToken(refreshToken, user._id);

        // send tokens in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });

        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });

        const userDto = new userDTO(user);

        // 6. response send
        return res.status(201).json({
            user: userDto,
            auth: true
        });
    },

    async login(req, res, next) {
        // 1. Input Validation
        const userLoginSchema = Joi.object({
            userName: Joi.string().min(0).max(30).required(),
            password: Joi.string().pattern(passwordPattern).required()
        });

        // 2. Validation error
        const {error} = userLoginSchema.validate(req.body);

        if(error) {
            return next(error);
        };

        // 3. Username and Password match
        const {userName, password} = req.body;

        let user;

        try {
            // Match input credentials
            user = await User.findOne({userName});

            if(!user) {
                const error = {
                    status: 401,
                    message: "This user does not exist, invalid Username"
                };

                return next(error);
            };

            const match = await bcrypt.compare(password, user.password);

            if(!match) {
                const error = {
                    status: 401,
                    message: "Invalid Password"
                };

                return next(error);
            };
        }
        catch(error) {
            return next(error);
        };

        // token generation
        const accessToken = JWTService.signAccessToken({_id: user._id}, '30m');
        const refreshToken = JWTService.signRefreshToken({_id: user._id}, '60m');

        // update database for the refresh token
        try{       
            await RefreshToken.updateOne(
            {
                _id: user._id
            },
            {
                token: refreshToken
            },
            {upsert: true})
        }
        catch(error) {
            return next(error)
        }

        // send tokens in cookie
        res.cookie('accessToken', accessToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });
        
        res.cookie('refreshToken', refreshToken, {
            maxAge: 1000*60*60*24,
            httpOnly: true
        });

        const userDto = new userDTO(user);

        // 4. Return Response
        return res.status(201).json({
            user: userDto,
            auth: true
        });
    },

    async logout(req, res, next) {
        // 1. Delete Refresh Token from the database
        const { refreshToken } = req.cookies
        try{
            await RefreshToken.deleteOne({
                token: refreshToken
            });
        }
        catch(error) {
            return next(error)
        }

        // delete cookie
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        // 2. Response
        return res.status(200).json({
            user: null,
            auth: false
        });
    },

    async refresh(req, res, next) {
        // 1. Get refreshtoken from the cookies
        const originalRefreshToken = req.cookies.refreshToken;
        let _id;

        try {
            _id = JWTService.verifyRefreshToken(originalRefreshToken)._id;
        }
        catch(error) {
            error = {
                status: 401,
                message: "Unauthorized"
            }

            return next(error);
        }

        // 2. Verify refreshtoken
        try {
            const match = RefreshToken.findOne({
                _id,
                token: originalRefreshToken
            });

            if(!match) {
                const error = {
                    status: 401,
                    message: "Unauthorized"
                }

                return next(error);
            }
        }
        catch(error)  {
            return next(error);
        }

        // 3. Generate New Token
        try {
            const accessToken = JWTService.signAccessToken({_id}, "30m");
            const refreshToken = JWTService.signRefreshToken({_id}, "60m");

            // 4. Update DB
            await RefreshToken.updateOne(
                {
                    _id,
                },
                {
                    token: refreshToken,
                }
            );

            // 5. Response
            res.cookie('accessToken', accessToken, {
                maxAge: 1000*60*60*24,
                httpOnly: true
            });
            
            res.cookie('refreshToken', refreshToken, {
                maxAge: 1000*60*60*24,
                httpOnly: true
            });
        }
        catch(error) {
            return next(error)
        }

        const user = await User.findOne({_id});

        const userDTO = new UserDTO(user);

        return res.status(200).json({
            user: userDTO,
            auth: true
        });
    }
}


module.exports = authController;