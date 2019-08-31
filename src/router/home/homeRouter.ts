import express from "express";
import * as homeController from "../../controller/home";
import URL from "../common/constants";
const router = express.Router();

router.get(URL.HOME, homeController.getHome);

export default router;
