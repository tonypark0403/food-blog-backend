import mongoose from "mongoose";
import bluebird from "bluebird";
import logger from "../util/logger";

const mongoUrl: any = process.env.MONGODB_URI;
mongoose.Promise = bluebird;

//TO avoid, (node:12552) DeprecationWarning: collection.ensureIndex is deprecated. Use createIndexes instead.
mongoose.set("useCreateIndex", true);

mongoose
  .connect(mongoUrl, { useNewUrlParser: true })
  .then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
  })
  .catch(err => {
    logger.debug(
      "MongoDB connection error. Please make sure MongoDB is running. " + err
    );
    // process.exit();
  });
