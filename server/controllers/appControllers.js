import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import otpGenerator from "otp-generator";
import UserModel from "../model/User.model.js";
import nodeMailer from "nodemailer";
import Mailgen from "mailgen";

dotenv.config();

/*POST: rigister user*/
export async function register(req, res) {
  const { email, username, password, profile } = req.body;
  //check if the username exist
  function checkUsername() {
    return new Promise(async (resolve, reject) => {
      const usernameInModel = await UserModel.findOne({ username: username });
      if (usernameInModel) reject("The username is already exist");
      resolve();
    });
  }
  //check if the email exist
  function checkEmail() {
    return new Promise(async (resolve, reject) => {
      const emailInModel = await UserModel.findOne({ email: email });
      if (emailInModel) reject("The email is already exist");
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
              profile,
            });
            //save user in memory
            user
              .save()
              .then((result) => {
                //send gmail to the user
                let config = {
                  service: "gmail",
                  auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                  },
                };
                let transporter = nodeMailer.createTransport(config);
                let MailGenerator = new Mailgen({
                  theme: "default",
                  product: {
                    name: "curry0312",
                    link: "https://github.com/curry0312",
                  },
                });
                let response = {
                  body: {
                    intro: "You have successfully registered!",
                    outro: "If you have any questions, contact us!",
                  },
                };
                let mail = MailGenerator.generate(response);
                let message = {
                  from: process.env.EMAIL,
                  to: email,
                  subject: "Register successfully",
                  html: mail,
                };
                transporter
                  .sendMail(message)
                  .then(() => {
                    return res.status(201).send({
                      user: result,
                      message:
                        "Create User successfully, we have send an email to you",
                    });
                  })
                  //catch error when failing sending email to the new user
                  .catch((error) => {
                    return res.status(500).send({
                      error,
                      message: "Something wrong with sending email",
                    });
                  });
              })
              //catch error when failing saving user.
              .catch((error) =>
                res.status(500).send({ error, msg: "Failed to save in db" })
              );
          })
          //catch error when failing hash password and create new model
          .catch((error) => {
            return res
              .status(500)
              .send({ error, msg: "Failed to hash password" });
          });
      }
    })
    .catch((error) => {
      return res.status(500).send({ error });
    });
}
/*POST: login user*/
export async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findOne({ username: username });
    const passwordIsSame = await bcrypt.compare(password, user.password);
    if (!passwordIsSame) {
      return res.status(404).send({ msg: "user's password is not correct" });
    } else {
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
    }
  } catch (error) {
    res.status(500).send({ error });
  }
}
/*GET: get user*/
export async function getUser(req, res) {
  const { username } = req.params;
  try {
    if (!username) return res.status(501).send({ error: "Invalid username" });
    const user = await UserModel.findOne({ username });
    if (!user) return res.status(404).send({ error: "User not found" });
    const { password, ...rest } = Object.assign({}, user.toJSON());
    return res
      .status(201)
      .send({ user: rest, msg: "Successfully find the user" });
  } catch (error) {
    return res.status(404).send({ error });
  }
}
/*PUT: update user*/
export async function updateUser(req, res) {
  try {
    //get from verifyJWTToken middleware
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
/*GET: get OTP*/
export async function generateOTP(req, res) {
  req.app.locals.OTP = otpGenerator.generate(6, {
    lowerCaseAlphabets: false,
    upperCaseAlphabets: false,
    specialChars: false,
  });
  res.status(201).send({ OTP: req.app.locals.OTP });
}
/*GET: verify OTP */
export async function verifyOTP(req, res) {
  const { OTP } = req.query;
  if (parseInt(OTP) === parseInt(req.app.locals.OTP)) {
    req.app.locals.OTP = null; //reset OTP
    req.app.locals.resetSession = true; //start reset password session
    return res.status(201).send({ msg: "Verify successfully!" });
  }
  return res.status(400).send({ error: "Invalid OTP" });
}
/*GET: go to reset Session */
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
      .then(async (hashedPassword) => {
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
