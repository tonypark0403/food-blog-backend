import express, { Router } from "express";
import homeRouter from "../home/homeRouter";
import middlewares from "../../middleware/middlewares";
import path from "path";
import URL from "../common/constants";

export const routerV1 = Router();

routerV1.use(middlewares);
routerV1.use(
  express.static(path.join(__dirname, "public"), { maxAge: 31557600000 })
);
routerV1.use(URL.PHOTO, express.static(path.join("photos")));

routerV1.use(URL.HOME, homeRouter);
