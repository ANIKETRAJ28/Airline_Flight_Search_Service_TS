import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import { PORT } from "./config/env.config";
import { corsOptions } from "./util/cors.util";

const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
