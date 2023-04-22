import nodeMailer from "nodemailer";
import Mailgen from "mailgen";
import dotenv from "dotenv";

dotenv.config()

export async function registerSendMail(req, res) {
  const { username, email } = req.body;
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
      name: username,
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
        message: "We have send an email to you",
      });
    })
    //catch error when failing sending email to the new user
    .catch((error) => {
      return res.status(500).send({
        error,
        message: "Something wrong with sending email",
      });
    });
}

export async function recoverPasswordMail(req, res) {
    const { username, email, OTP } = req.body;
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
        name: username,
        intro: `Your recovery password OTP is ${OTP}`,
        outro: "If you have any questions, contact us!",
      },
    };
    let mail = MailGenerator.generate(response);
    let message = {
      from: process.env.EMAIL,
      to: email,
      subject: "Recover Password",
      html: mail,
    };
    transporter
      .sendMail(message)
      .then(() => {
        return res.status(201).send({
          message: "We have send an email to you",
        });
      })
      //catch error when failing sending email to the new user
      .catch((error) => {
        return res.status(500).send({
          error,
          message: "Something wrong with sending email",
        });
      });
  }