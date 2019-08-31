import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { getUserInfo, userRegistration } from "./userService";
import logger from "../common/util/logger";
import ModelValidator from "../common/util/validator";
import { UserRegisterDAO } from "./userTypes";

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
    let userRegisterDAO: UserRegisterDAO = new UserRegisterDAO();
    ModelValidator(req.body, userRegisterDAO, (err: any) => {
      if (err) {
        throw err;
      }
    });
    userRegisterDAO = req.body;
    const result = await userRegistration(userRegisterDAO);
    console.log("userRegister : ", result);
    res.status(200).send({ status: "success" });
  } catch (error) {
    logger.error(error);
    res.status(400).send({ error: error });
  }
};
