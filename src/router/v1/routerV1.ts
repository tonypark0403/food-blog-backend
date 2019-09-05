import express, { Router } from "express";
import path from "path";
import "../common/util/envInfo";
import homeRouter from "../home/homeRouter";
import userRouter from "../user/userRouter";
import reviewRouter from "../review/reviewRouter";
import middlewares from "../../middleware/middlewares";
import URL from "../common/constants";
import "../user/passport/passport";
import "../common/db/mongoDB";

export const routerV1 = Router();

routerV1.use(middlewares);
routerV1.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
routerV1.use(URL.PHOTO, express.static(path.join("photos")));

routerV1.use(URL.HOME, homeRouter);
routerV1.use(URL.USER, userRouter);
routerV1.use(URL.REVIEW, reviewRouter);
routerV1.use(URL.PLACE, reviewRouter);
