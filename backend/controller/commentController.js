const Joi = require("joi");
const Comment = require('../models/comment');
const CommentDTO = require('../dto/comment');

const mongoIdPattern = /^[0-9a-fA-F]{24}$/

const commentController = {

    async create(req, res, next) {
        // 1. Validate req body
        const createCommentSchema = Joi.object({
            content: Joi.string().required(),
            blog: Joi.string().regex(mongoIdPattern).required(),
            author: Joi.string().regex(mongoIdPattern).required(),
        });

        const {error} = createCommentSchema.validate(req.body);
        if(error) {
            return next(error);
        }

        const {content, blog, author} = req.body;

        // 2. Save the the commnet in the database
        try{
            const comment = new Comment({
                content,
                blog,
                author,
            });

            await comment.save();
        }
        catch(error) {
            return next(error);
        }

        return res.status(201).json({
            message: 'commented created!'
        });
    },

    async findOne(req, res, next) {
        // 1. Validate Id
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongoIdPattern).required(),
        });

        const {error} = getByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }

        // 2. Fetch the Id from the database
        const {id} = req.params;
        let comments;

        try {
            comments = await Comment.find({
                blog: id
            }).populate('author');
        }
        catch(error) {
            return next(error);
        }

        // 3. Reponse
        const commentDTO = [];

        for(let i = 0; i < comments.length; i++){
            const commentData = new CommentDTO(comments[i]);

            commentDTO.push(commentData);
        }

        return res.status(200).json({
            data: commentDTO
        })
    }
}

module.exports = commentController