import express from "express";
import { tryLocalLogin, tryGoogleLogin } from "./passport/login";
import { Authorize } from "./authService";
import * as userController from "./userController";
import URL from "../common/constants";

const router = express.Router();

router.get(URL.HOME, Authorize, userController.getUser);
router.post(URL.LOGIN, tryLocalLogin, userController.postUser);
router.get(URL.GOOGLE, tryGoogleLogin, userController.getGoogleUser);
router.post(URL.REGISTER, userController.registerUser);
router.get(URL.HOME + ":Email", userController.getReviewByEmail);

export default router;
