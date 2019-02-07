exports.DATABASE_URL = process.env.DATABASE_URL ||
                        'mongodb://localhost:27017/blog-api-comments';
exports.PORT = process.env.PORT || 8080;