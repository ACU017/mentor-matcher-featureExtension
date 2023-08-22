var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
const userShouldBeLoggedIn = require("../guards/userShouldBeLoggedIn");
var db = require("../model/helper");
require("dotenv").config();
var bcrypt = require("bcrypt");
const saltRounds = 10;

const supersecret = process.env.SUPER_SECRET;

router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hash = await bcrypt.hash(password, saltRounds);

    await db(
      `INSERT INTO users (username, password) VALUES ("${username}", "${hash}")`
    );

    res.send({ message: "Register successful" });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.post("/auth", async (req, res) => {
  const { username, password } = req.body;

  try {
    const results = await db(
      `SELECT * FROM users WHERE username = "${username}"`
    );
    const user = results.data[0];
    // check if the user exist
    if (user) {
      // here you store the password
      const user_id = user.id;
      // check if the password is correct bcrypt method compare
      const correctPassword = await bcrypt.compare(password, user.password);
      // this returns a boolean if password is not correct = trhow error

      // if the password is correct generate a token use super secret to encode and decode the token
      if (!correctPassword) throw new Error("Incorrect password");

      //sign in takes 2 arguments the payload and the secret
      const token = jwt.sign({ user_id }, supersecret);

      // If I have a object with user_id is the same as  {user_id:user_id}
      res.send({ message: "Login successful, here is your token", token });
    } else {
      throw new Error("User does not exist");
    }
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

router.get("/profile", userShouldBeLoggedIn, (req, res) => {
  res.send({
    message: "Here is the PROTECTED data for user " + req.user_id,
  });
});

module.exports = router;
