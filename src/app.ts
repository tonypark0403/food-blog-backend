import express from "express";
import { routerV1 } from "./router/v1/routerV1";
import URL from "./router/common/constants";
import "./router/user/passport/passport";
import "./router/common/db/mongoDB";

const app = express();

app.use(URL.HOME, routerV1);

app.set("port", process.env.PORT || 9000);
app.set("httpsPort", process.env.HTTPSPORT || 9001);

export default app;
