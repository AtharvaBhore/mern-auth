import {signup,signin,google} from "../controllers/authController.js"
import express from "express"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)
router.post("/google", google)

export {router as authRoutes}