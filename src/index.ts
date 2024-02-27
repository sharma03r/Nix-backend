import { connectToDatabase } from "./db/connection.js";
import express from "express";
import { config } from "dotenv";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const PORT = process.env.PORT || 8000;
//connections and listeners

config();
const app = express();

//middlewares
app.use(cors({ origin: "https://nix-three.vercel.app", credentials: true }));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(morgan("dev"));
connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server opened and connected to database");
    });
  })
  .catch((err) => {
    console.log(`Error occured ${err}`);
  });

app.use("/api/v1", appRouter);
