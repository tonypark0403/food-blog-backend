import { RequestHandler } from "express";

export const getHome: RequestHandler = (req, res, next) => {
  console.log("start");
  res.status(200).send("Welcome web server");
};
