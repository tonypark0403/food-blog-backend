import jwt from "jsonwebtoken";
import { RequestHandler } from "express";

export const Authorize: RequestHandler = (req, res, next) => {
  const authorizationInfo = req.headers.authorization
    ? req.headers.authorization.split(" ")
    : [];
  if (authorizationInfo[0] === "Bearer") {
    const SESSION_SECRET: any = process.env.SESSION_SECRET;
    jwt.verify(
      authorizationInfo[1],
      SESSION_SECRET,
      { algorithms: ["HS512"] },
      (err: any, decoded: any) => {
        if (err) {
          return res.status(400).send({ error: err });
        }
        req.user = decoded;
        return next();
      }
    );
  } else {
    return res.status(400).send({ error: "Bearer token is required" });
  }
};
