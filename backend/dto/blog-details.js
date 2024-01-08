class BlogDetailsDTO {
    constructor(blogDetail) {
        this._id = blogDetail._id;
        this.content = blogDetail.content;
        this.title = blogDetail.title;
        this.photo = blogDetail.photoPath;
        this.createdAt = blogDetail.createdAt
        this.authorName = blogDetail.author.name;
        this.authorUsername = blogDetail.author.userName;
    }
}

module.exports = BlogDetailsDTO;