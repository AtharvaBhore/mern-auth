import {signup,signin} from "../controllers/authController.js"
import express from "express"

const router = express.Router()

router.post("/signup", signup)
router.post("/signin", signin)

export {router as authRoutes}