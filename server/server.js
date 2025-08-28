import express from 'express';
import 'dotenv/config';
import cors from 'cors';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/db.js'; 



const app = express();


await connectDB();
await connectCloudinary();


app.use(express.json());
app.use(cors());



app.get('/', (req, res) => res.send("Api is working"))


const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})