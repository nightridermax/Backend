import {Router} from 'express';
import {registerUser, loginUser, logoutUser, refreshAccessToken} from '../controllers/user.controllers.js';
import { upload } from '../middleware/multter.middleware.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 3
        }
    ]),
    registerUser
)

router.route("/login").post(loginUser)

//secured routes
router.route("/logout").post(verifyJWT, logoutUser)
router.route("/refresh-token").post(verifyJWT, refreshAccessToken)

export default router 