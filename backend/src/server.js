import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';

const app = express();

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