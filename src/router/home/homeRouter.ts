import express from "express";
import * as homeController from "./homeController";
import URL from "../common/constants";
const router = express.Router();

router.get(URL.HOME, homeController.getHome);

export default router;
