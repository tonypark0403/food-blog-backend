import errorHandler from "errorhandler";

import app from "./app";
import https from "https";
import fs from "fs";
import path from "path";

/**
 * Error Handler. Provides full stack - remove for production
 */
app.use(errorHandler());

/**
 * Start Express server.
 */
//...

https
  .createServer(
    {
      key: fs.readFileSync(path.join(__dirname, "./cert/server.key")),
      cert: fs.readFileSync(path.join(__dirname, "./cert/server.cert"))
    },
    app
  )
  .listen(app.get("httpsPort"), () => {
    console.log(
      "   HTTPS App is running at https://localhost:%d in %s mode",
      app.get("httpsPort"),
      app.get("env")
    );
  });

const server = app.listen(app.get("port"), () => {
  console.log(
    "   HTTP App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("Press CTRL-C to stop\n");
});

export default server;
