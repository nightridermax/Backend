import {Router} from 'express';
import {registerUser} from '../controllers/user.controllers.js';
import { upload } from '../middleware/multter.middleware.js';

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

export default router 