import UserModel from "../model/User.model.js";

/*middleware for verify user*/
export default async function verifyUser(req, res, next) {
    try {
      const { username } = req.method === "GET" ? req.query : req.body;
      //check the username existance
      let exist = await UserModel.findOne({ username: username });
      if (!exist) return res.status(404).send({ error: "Can't find the user" });
      next();
    } catch (error) {
      return res.status(404).send({ error: "Authentication Error" });
    }
  }