// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

// Connection URL and Database Name
const url = 'mongodb://localhost:27017';
const dbName = 'KajalBlog';

// Create Express application
const app = express();
app.use(bodyParser.json());

// Connect to MongoDB and create sample data
MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
    if (err) {
        console.error('Error occurred while connecting to MongoDB', err);
        return;
    }
    console.log('Connected to MongoDB');

    const db = client.db(dbName);

    // Sample users, blog posts, and comments data
    const users = [
        { username: 'user1', email: 'user1@example.com' },
        { username: 'user2', email: 'user2@example.com' }
    ];

    const blogPosts = [
        { title: 'Post 1', content: 'Content of post 1', userId: 1 },
        { title: 'Post 2', content: 'Content of post 2', userId: 2 }
    ];

    const comments = [
        { postId: 1, text: 'Comment 1 on Post 1', userId: 2 },
        { postId: 1, text: 'Comment 2 on Post 1', userId: 1 },
        { postId: 2, text: 'Comment 1 on Post 2', userId: 1 }
    ];

    // Populate database with sample data
    db.collection('users').insertMany(users, (err, result) => {
        if (err) {
            console.error('Error occurred while populating users', err);
        } else {
            console.log('Users inserted:', result.insertedCount);
        }
    });

    db.collection('blogPosts').insertMany(blogPosts, (err, result) => {
        if (err) {
            console.error('Error occurred while populating blog posts', err);
        } else {
            console.log('Blog posts inserted:', result.insertedCount);
        }
    });

    db.collection('comments').insertMany(comments, (err, result) => {
        if (err) {
            console.error('Error occurred while populating comments', err);
        } else {
            console.log('Comments inserted:', result.insertedCount);
        }
    });

    // API endpoints for adding, reading, and deleting comments
    app.post('/comments', (req, res) => {
        const newComment = req.body;
        db.collection('comments').insertOne(newComment, (err, result) => {
            if (err) {
                res.status(500).send('Error occurred while adding comment');
            } else {
                res.status(201).send('Comment added successfully');
            }
        });
    });

    app.get('/comments/:postId', (req, res) => {
        const postId = parseInt(req.params.postId);
        db.collection('comments').find({ postId }).toArray((err, comments) => {
            if (err) {
                res.status(500).send('Error occurred while fetching comments');
            } else {
                res.status(200).json(comments);
            }
        });
    });

    app.delete('/comments/:commentId', (req, res) => {
        const commentId = parseInt(req.params.commentId);
        db.collection('comments').deleteOne({ _id: commentId }, (err, result) => {
            if (err) {
                res.status(500).send('Error occurred while deleting comment');
            } else {
                res.status(200).send('Comment deleted successfully');
            }
        });
    });

    // Start the Express server
    app.listen(3000, () => {
        console.log('Server started on port 3000');
    });
});