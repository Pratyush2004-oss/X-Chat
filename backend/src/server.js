import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express'

import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

// importing routers from route directory
import userRoutes from './routes/user.route.js'
import postRoutes from './routes/post.route.js'
import commentRoutes from './routes/comment.route.js';
import NotificationRoutes from './routes/notifications.route.js';

// importing arcjet middleware for security purposes
import { arcjetMiddleware } from './middleware/arcjet.middleware.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use(clerkMiddleware());
app.use(arcjetMiddleware);

app.get("/", (req, res) => {
    res.send("X-chat is now Live");
})

app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/notifications', NotificationRoutes);

// error handling middleware
app.use((err, req, res, next) => {
    console.error("Unhandled error: ", err);
    res.status(500).json({ error: `Error in server ${err.message}` || "Internal Server Error" })
})

const startServer = async () => {
    try {
        await connectDB();
        // listen to local development
        if (ENV.NODE_ENV !== 'production') {
            app.listen(ENV.PORT, () => {
                console.log(`Server listening on port ${ENV.PORT}`);
            })
        }
    } catch (error) {
        console.log("Failed to start Server:" + error.message);
        process.exit(1);
    }
}
startServer();

// export for vercel
export default app;