const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

// generating new token
router.post("/token/getToken", (req, res) => {
  const { username, rolecode } = req.body;
  let payload = { username: username, rolecode: rolecode };
  const token = jwt.sign(payload, process.env.SECRET_KEY);
  res.send({ token: token });
});
// generating token with expire time for refresh token scenario
router.post("/token/getTokenExpire", (req, res) => {
  const { username, rolecode } = req.body;
  let payload = { username: username, rolecode: rolecode };
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "60s" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "30m",
  });
  res.send({
    token: token,
    refreshToken: refreshToken,
    expireTime: "60 seconds",
  });
});
// new token against refresh token
router.post("/token/getrefreshToken", (req, res) => {
  const { username, rolecode, refreshtoken } = req.body;
  let payload = { username: username, rolecode: rolecode };
  jwt.verify(refreshtoken, process.env.REFRESH_SECRET_KEY, (err, suc) => {
    if (err) {
      res.send("invalid token");
    } else {
      const token = jwt.sign(payload, process.env.SECRET_KEY, {
        expiresIn: "60s",
      });
      const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "30m",
      });
      res.send({
        token: token,
        refreshToken: refreshToken,
        expireTime: "60 seconds",
        Message: "new token Against the refresh token",
      });
    }
  });
  const token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: "60s" });
  const refreshToken = jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
    expiresIn: "30m",
  });
  res.send({
    token: token,
    refreshToken: refreshToken,
    expireTime: "60 seconds",
  });
});
module.exports = router;
