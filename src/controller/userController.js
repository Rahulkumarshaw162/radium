const userModel = require("../model/userModel");

const createUser = async function (req, res) {
  let user = req.body;
  user.freeAppUser = req.isFreeAppUser//this attribute was set in req in the appMiddleware
  let savedUser = await userModel.create(user);
  res.send({ msg: savedUser });
};
module.exports.createUser=createUser;