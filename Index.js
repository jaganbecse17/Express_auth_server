const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv/config");
const port = process.env.port || 3030;
app.use(express.json());

// use it before middle for access end point with tokens
const tokenRouter = require("./Routers/Token");
app.use("/api", tokenRouter);
// middlewares
// validate request with tokens
app.use(function validateToken(req, res, next) {
  const { authorization } = req.headers;
  jwt.verify(authorization, process.env.SECRET_KEY, (err, suc) => {
    if (err) {
      res.send(401);
    } else {
      console.log("request with valid token");
      next();
    }
  });
});
// using end points from routers
const UsersRouter = require("./Routers/users");
// using end points from token
app.use("/api", UsersRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
