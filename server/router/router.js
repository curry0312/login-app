import { Router } from "express";
const router = Router();

/*Import all controllers*/
import * as controllers from "../controllers/appControllers.js";
/*Import Middleware*/
import verifyUser from "../middleware/verifyUsername.js";
import verifyJWTToken from "../middleware/verifyJWTToken.js";
import localVariables from '../middleware/localVariable.js'

/*POST Methods*/
router.route("/register").post(controllers.register);
router.route("/registerMail").post();
router.route("/authenticate").post((req, res) => res.end());
router.route("/login").post(verifyUser, controllers.login);

/*GET Methods*/
router.route("/user/:username").get(controllers.getUser);
router.route("/generateOTP").get(verifyUser, localVariables, controllers.generateOTP);
router.route("/verifyOTP").get(controllers.verifyOTP);
router.route("/createResetSession").get(controllers.createResetSession);

/*PUT Methods*/
router.route("/updateuser").put(verifyJWTToken, controllers.updateUser);
router.route("/resetPassword").put(verifyUser, controllers.resetPassword);

export default router;
