import express from "express";
import helmet from "helmet";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
    res.status(200).json({ 
        message: "OK",
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
     });
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
