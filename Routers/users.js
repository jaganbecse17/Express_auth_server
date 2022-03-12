// import statements
const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

// storing users data in local runtime memeory/ use DB to store it
// all data will cleared after reloading
var users = [];
// get the list of user
router.get("/UsersList", (req, res) => res.send(users));
// creating new user
router.post("/CreateUser", async (req, res) => {
  try {
    const { username, password } = req.body;
    // create salt
    const salt = await bcrypt.genSalt();
    // hash password and add to users array
    const hashed = await bcrypt.hash(password, salt);
    users.push({ username: username, password: hashed });
    res.send("user created successfuly");
  } catch (error) {
    res.send(404);
  }
});
// login as existing user and with correct password
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const Existing_User = users.find((user) => user.username === username);
  if (Existing_User == null) {
    res.send("no user");
  }
  try {
    const validuser = await bcrypt.compare(password, Existing_User.password);
    if (validuser) {
      res.send({ username: username, password: Existing_User.password });
    } else {
      res.send("not valid user");
    }
  } catch (error) {}
});

router.post("/ChangePassword", async (req, res) => {
  const { username, oldpassword, newpassword } = req.body;
  const Existing_User = users.find((user) => user.username === username);
  if (Existing_User == null) {
    res.send("no user found");
  } else {
    try {
      const validuser = await bcrypt.compare(
        oldpassword,
        Existing_User.password
      );
      if (validuser) {
        // change  password
        // this logic is for current scenario
        let temp_users = users.filter((user) => user.username != username);
        // password hash
        const salt = await bcrypt.genSalt();
        const hashed = await bcrypt.hash(newpassword, salt);
        temp_users.push({ username: username, password: hashed });
        users = temp_users;
        res.send("passchanged successfuly");
      } else {
        // wrong password
        res.send("wrong old password");
      }
    } catch (error) {
      res.send(501);
      console.log(error);
    }
  }
});
module.exports = router;
// export default users;
