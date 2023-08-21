var jwt = require("jsonwebtoken");
require("dotenv").config();
const supersecret = process.env.SUPER_SECRET;

// check if the user is logged in
function isUserloggedIn(req, res, next) {
  // check the if there's a token
  const token = req.headers["authorization"].replace(/^Bearer\s/, "");

  // if I don't have a token send a error !
  if (!token) {
    res.status(401).send({ message: "please provide a token" });
  } else {
    // check if the token is valid  err token is not valid / decoded is to acces the data in the payload
    jwt.verify(token, supersecret, function (err, decoded) {
      // the token is not valid, send an erro
      if (err) res.status(401).send({ message: err.message });
      //everything is awesome | the payload is {user_id:3}
      else {
        // create a new key in the object name user id and assign it to the payload of the token
        req.user_id = decoded.user_id;
        next(); // move on to the next step
      }
    });
  }
}

module.exports = isUserloggedIn;
