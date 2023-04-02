import express from "express";
import dotenv from "dotenv"
import cors from "cors";
import morgan from "morgan";
import connect from "./database/connect.js";
import router from "./router/router.js";

dotenv.config()
const app = express();

/*Middleware*/
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));
app.disable("x-powered-by");

const port = 8080;

/*HTTP GET Request*/
app.get("/", (req, res) => {
  res.status(201).json("Home get request");
});

app.use("/api", router);

async function start() {
  try {
    await connect();
    app.listen(port, () => {
      console.log(`Listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();
