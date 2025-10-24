import express from "express";
import helmet from "helmet";
import cors from "cors";
import customerRoutes from "./routes/customerRoutes";
import { errorHandler, notFoundHandler } from "./middlewares/errorHandler";

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

app.use('/api/customers', customerRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
