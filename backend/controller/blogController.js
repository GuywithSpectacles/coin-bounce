const Joi = require('joi');
const fs = require('fs');
const {BACKEND_SERVER_PATH} = require('../config/index');
const Blog = require('../models/blog');
const BlogDTO = require('../dto/blog');
const BlogDetailsDTO = require('../dto/blog-details');


const mongoIdPattern = /^[0-9a-fA-F]{24}$/
const photoBufferPattern = /^data:image\/(png|jeg|jpeg);base64,/

const blogController = {
    async create(req, res, next){
        // 1. Validate req body
        const createBlogSchema = Joi.object({
            title: Joi.string().required(),
            content: Joi.string().required(),
            author: Joi.string().regex(mongoIdPattern).required(),

            // client side -> base64 encoded string -> decode -> store -> save photopath in db
            photo: Joi.string().required(),
        });
        const {error} = createBlogSchema.validate(req.body);

        if(error) {
            return next(error);
        }
        
        const {title, content, author, photo} = req.body;

        // 2. Handle photo storage and naming convention

        // a. read as buffer
        const buffer = Buffer.from(photo.replace(photoBufferPattern, ''), 'base64');

        // b. allot a random string/name
        const imagePath = `${Date.now()}-${author}.png`;

        // c. save locally
        try{                // path      filename
            fs.writeFileSync(`storage/${imagePath}`, buffer);
        }
        catch(error) {
            return next(error);
        }

        // 3. Save the record in DB
        let blog;

        try{
            blog = new Blog({
                title,
                content,
                author,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            });

            await blog.save();
        }
        catch(error) {
            return next(error);
        }

        // 4. Response 
        const blogDTO = new BlogDTO(blog);

        return res.status(201).json({
            blog: blogDTO,
        });
    },

    async getAll(req, res, next){

        try{
            const blogs = await Blog.find({});

            const blogsDTO = [];

            for(let i = 0; i < blogs.length; i++){
                const blogData = new BlogDTO(blogs[i]);

                blogsDTO.push(blogData);
            }

            return res.status(200).json({
                blogs: blogsDTO,
            });
        }
        catch(error) {
            return next(error);
        }
    },

    async findOne(req, res, next){
        // 1. Validate id
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongoIdPattern).required(),
        });

        const {error} = getByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }

        // 2. Response
        const {id} = req.params;
        let blog;

        try{
            blog = await Blog.findOne({
                _id: id,
            }).populate('author');

        }
        catch(error) {
            return next(error);
        }

        const blogDTO = new BlogDetailsDTO(blog);

        return res.status(200).json({
            blog: blogDTO
        });
    },

    async update(req, res, next){
        // 1. Validate 
        const updateBlogSchema = Joi.object({
            blogId: Joi.string().regex(mongoIdPattern).required(),
            title: Joi.string(),
            content: Joi.string(),
            author: Joi.string().regex(mongoIdPattern).required(),
            photo: Joi.string(),
        });

        const {error} = updateBlogSchema.validate(req.body);
        if(error) {
            return next(error);
        };

        const {blogId, title, content, author, photo} = req.body;

        // 2. Photo handling 
        let blog;

        try {
            blog = await Blog.findOne({
                _id: blogId
            });
        }
        catch(error) {
            return next(error)
        }

        if(photo) {
            let previousPhoto = blog.photoPath;

            previousPhoto = previousPhoto.split('/').at(-1);

            // a. Delete previous photo
            fs.unlinkSync(`storage/${previousPhoto}`);

            // b. Save new photo

            // i. read as buffer
            const buffer = Buffer.from(photo.replace(photoBufferPattern, ''), 'base64');

            // ii. allot a random string/name
            const imagePath = `${Date.now()}-${author}.png`;

            // iii. save locally
            try{                // path      filename
                fs.writeFileSync(`storage/${imagePath}`, buffer);
            }
            catch(error) {
                return next(error);
            }

        // 3. Updation
            await Blog.updateOne({
                _id: blogId,
            },
            {
                title,
                content,
                photoPath: `${BACKEND_SERVER_PATH}/storage/${imagePath}`,
            }
            )
        }
        else {
            await Blog.updateOne({
                _id: blogId,
            },
            {
                title,
                content,
            }
            )
        }

        // 4. Response

        return res.status(200).json({
            message: 'blog updated!'
        });
    },

    async delete(req, res, next){
        // 1. Validate id
        const getByIdSchema = Joi.object({
            id: Joi.string().regex(mongoIdPattern).required(),
        });

        const {error} = getByIdSchema.validate(req.params);
        if(error) {
            return next(error);
        }

        const {id} = req.params;

        try{
            // 2. Delete blog
            await Blog.deleteOne({
                _id: id
            });
            
            // 3. Delete comments
            await Blog.deleteMany({
                blog: id
            });
        }
        catch(error) {
            return next(error);
        }

        // 4. Response
        return res.status(200).json({
            message: 'blog deleted!',
        });
    },
};

module.exports = blogController;