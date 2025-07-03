import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

// importing routers from route directory
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'

const app = express();
app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// error handling middleware
app.use((err, req, res) => {
    console.error("Unhandled error: ", err);
    res.status(500).json({ error: err.message || "Internal Server Error" })
})

const startServer = async () => {
    try {
        await connectDB();
        app.listen(ENV.PORT, () => {
            console.log(`Server listening on port ${ENV.PORT}`);
        })
    } catch (error) {
        console.log("Failed to start Server:" + error.message);
        process.exit(1);
    }
}
startServer();