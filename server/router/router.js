import { Router } from "express";
const router = Router();

/*Import all controllers*/
import * as controllers from "../controllers/controllers.js";

/*POST Methods*/
router.route("/register").post(controllers.register);
// router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => res.end());
router.route("/login").post(controllers.verifyUser,controllers.login);

/*GET Methods*/
router.route("/user/:username").get(controllers.getUser);
router.route("/generateOTP").get(controllers.generateOTP);
router.route("/verifyOTP").get(controllers.verifyOTP);
router.route("/createResetSession").get(controllers.createResetSession);

/*PUT Methods*/
router.route("/updateuser").put(controllers.updateUser);
router.route("/resetPassword").put(controllers.resetPassword);

export default router;
