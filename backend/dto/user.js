class UserDTO {
    constructor(user) {
        this._id = user._id,
        this.name = user.name,
        this.userName = user.userName,
        this.email = user.email
    }
}

module.exports = UserDTO;