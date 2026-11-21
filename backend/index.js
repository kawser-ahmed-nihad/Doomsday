import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db/db.js';
import movieRoutes from './routes/movieRoutes.js';

const port = process.env.PORT || 3000;
const app = express();
app.use(cors());
app.use(express.json());



// --- API routes ---
app.get("/", (req, res) => res.send("test"));


app.use("/api/movies", movieRoutes);



try {
    await connectDB();

    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
} catch (error) {
    console.error('Server startup failed:', error);

}