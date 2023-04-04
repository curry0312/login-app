import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import UserModel from "../model/User.model.js";

dotenv.config();

//POST
export async function register(req, res) {
  const { email, username, password, profile } = req.body;
  //check if the username exist
  function checkUsername() {
    return new Promise(async (resolve, reject) => {
      const usernameInModel = await UserModel.findOne({ username: username });
      if (usernameInModel) reject(new Error("The username is already exist"));
      resolve();
    });
  }
  //check if the email exist
  function checkEmail() {
    return new Promise(async (resolve, reject) => {
      const emailInModel = await UserModel.findOne({ email: email });
      if (emailInModel) reject(new Error("The email is already exist"));
      resolve();
    });
  }

  //When validation complete, invoke this
  Promise.all([checkUsername, checkEmail])
    .then(() => {
      console.log();
      if (password) {
        //translate password into hashed
        bcrypt
          .hash(password, 10)
          .then((hashedPassword) => {
            const user = new UserModel({
              username,
              password: hashedPassword,
              email,
              profile: profile || "",
            });
            //save user in memory
            user
              .save()
              .then((result) =>
                res
                  .status(201)
                  .send({ message: "Create User successfully", result })
              )
              .catch((error) =>
                res.status(500).send({ error, msg: "Failed to save in db" })
              );
          })
          .catch((error) => {
            return res.status(500).send(error);
          });
      }
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
}
//POST
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    const passwordIsSame = await bcrypt.compare(password, user.password);
    if (!passwordIsSame)
      return res.status(404).send({ msg: "user's password is not correct" });
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
      },
      process.env.JWT_SECRET,
      { expiresIn: 86400 }
    );
    console.log(token);
    return res.status(201).send({
      msg: "found the user, login successfully....!",
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).send({ err });
  }
}
//GET
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid username" });
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });
    const { password, ...rest } = Object.assign({}, user.toJSON());
    return res
      .status(201)
      .send({ msg: "Successfully find the user", user: rest });
  } catch (error) {
    return res.status(404).send({ error: "Can't find user's data" });
  }
}
//PUT
export async function updateUser(req, res) {
  try {
    const { userId } = req.user;
    if (userId) {
      const body = req.body;
      const result = await UserModel.updateOne({ _id: userId }, body);
      return res.status(201).send({ msg: "Update user success!", result });
    } else {
      return res.status(404).send({ error: "UserId is invalid" });
    }
  } catch (error) {
    return res.status(401).send({ error });
  }
}
//GET
export async function generateOTP(req, res) {
  req.app.locals.OTP = await otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ OTP: req.app.locals.OTP });
}
//GET
export async function verifyOTP(req, res) {
  const { OTP } = req.query;
  if (parseInt(OTP) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null; //reset OTP
    req.app.locals.resetSession = true; //start reset password session
    return res.status(201).send({ msg: "Verify successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}
//GET
export async function createResetSession(req, res) {
  if (req.app.locals.resetSession) {
    req.app.locals.resetSession = false; //allow access to this route only once
    return res.status(201).send({ msg: "access granted!" });
  }
  return res.status(440).send({ error: "session expired" });
}
//PUT
export async function resetPassword(req, res) {
  try {
    if (!req.app.locals.resetSession)
      res.status(440).send({ error: "session expired" });
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    bcrypt
      .hash(password, 10)
      .then( async (hashedPassword) => {
        const result = await UserModel.updateOne(
          { username: user.username },
          { password: hashedPassword }
        );
        req.app.locals.resetSession = false;
        res
          .status(201)
          .send({ msg: "Reset password successfully...!", result });
      })
      .catch((error) =>
        res.status(401).send({ error, msg: "Reset password failed" })
      );
  } catch (error) {
    res.status(401).send({ error });
  }
}