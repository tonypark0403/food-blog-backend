import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getUserInfo, userRegistration } from "./userService";
import logger from "../common/util/logger";
import ModelValidator from "../common/util/validator";
import { UserRegisterType } from "./userTypes";
import { User } from "./userModel";

const SESSION_SECRET: any = process.env.SESSION_SECRET;

export const getUser: RequestHandler = (req: any, res) => {
  try {
    getUserInfo(req.user.Email).subscribe(
      user => {
        res.status(200).json(user);
      },
      err => {
        throw `${err} --> DB error`;
      }
    );
  } catch (err) {
    logger.error(err);
    res.status(400).json({ error: err });
  }
};

export const postUser: RequestHandler = (req: any, res, next) => {
  const token = jwt.sign({ Email: req.user.Email }, SESSION_SECRET, {
    algorithm: "HS512",
    expiresIn: "1d"
  });
  res.status(200).json({
    success: true,
    token: token
  });
};

export const getGoogleUser: RequestHandler = (req: any, res, next) => {
  try {
    const token = jwt.sign({ Email: req.user.Email }, SESSION_SECRET, {
      algorithm: "HS512",
      expiresIn: "1d"
    });

    res.redirect(`${req.query.state}${token}`);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const registerUser: RequestHandler = async (req, res, next) => {
  try {
    logger.debug(req.body);
    let UserRegister: UserRegisterType = new UserRegisterType();
    ModelValidator(req.body, UserRegister, (err: any) => {
      if (err) {
        throw err;
      }
    });
    UserRegister = req.body;
    const result = await userRegistration(UserRegister);
    console.log("userRegister : ", result);
    res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error });
  }
};

export const getReviewByEmail: RequestHandler = async (req, res, next) => {
  try {
    if (req.params.Email === undefined) {
      throw "Email param is required";
    }
    const user: any = await User.findOne({ Email: req.params.Email }).populate(
      "Reviews"
    );
    res.status(200).send(user.Reviews);
  } catch (err) {
    res.status(400).send({ error: err });
  }
};
