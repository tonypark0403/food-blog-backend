import express, { Request, Response } from "express";
import * as placeController from "./placeController";
import URL from "../common/constants";

const router = express.Router();

router.get(URL.AUTOCOMPLETE, placeController.getAutoComplete);
router.get(URL.DETAIL, placeController.getDetail);
router.get(URL.AUTOCOMPLETEINCITY, placeController.getAutoCompleteInCity);

export default router;
