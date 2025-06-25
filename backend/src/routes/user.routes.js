import { Router } from "express";
import { registerUser,loginUser,updateUser,logoutUser } from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/update-account").patch(verifyJWT, updateUser);
router.route("/logout").post(verifyJWT, logoutUser);


export default router;