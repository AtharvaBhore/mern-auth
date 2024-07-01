import {signup,signin,google,signout} from "../controllers/authController.js"
import express from "express"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)
router.get("/signout", signout)

export {router as authRoutes}