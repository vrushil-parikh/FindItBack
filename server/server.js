import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js';
import postRoutes from './routes/postRoutes.js';
// import { clerkWebhooks } from './controllers/webhooks.js';
// import { clerkMiddleware } from '@clerk/express'

const startServer = async () => {
    try {
        const app = express();
        await connectDB();
        await connectCloudinary();


        app.use(cors());
        app.use(express.json());
        // app.use(clerkMiddleware())
        app.use('/posts', postRoutes);

        app.get('/', (req, res) => res.send("Api is working"))
        // app.post('/webhooks',clerkWebhooks)

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Error starting server:', error);
        process.exit(1); // Exit process with failure
    }
};
startServer();