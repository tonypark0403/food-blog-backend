import express from "express";
import * as reviewController from "./reviewController";
import { Authorize } from "../user/authService";
import URL from "../common/constants";

const router = express.Router();

router.get(URL.HOME, reviewController.getReview);

router.post(URL.HOME, Authorize, reviewController.postReview);

router.delete(URL.HOME + ":id", Authorize, reviewController.deleteReview);

export default router;
