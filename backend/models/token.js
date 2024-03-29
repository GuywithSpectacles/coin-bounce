const mongoose = require('mongoose');

const { Schema } = mongoose;

const refreshTokenSchema = Schema({
    token: {
        type: String,
        required: true
    },
    userID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    }
},
{timestamps: true}
);

                            //   ModelName      ModelSchema         DB Collection
module.exports = mongoose.model('RefreshToken', refreshTokenSchema, 'tokens')