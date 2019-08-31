import express from "express";
const app = express();
import dotenv from "dotenv";
dotenv.config();
import helmet from "helmet";
import compression from "compression";
import bodyParser from "body-parser";
import cors from "cors";
import morgan from "morgan";

app.use(compression());
app.use(cors());
app.use(morgan("combined"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(helmet());

export default app;
