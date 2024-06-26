import {getUsers} from "../controllers/userController.js"
import express from "express"

const router = express.Router()

router.get("/all", getUsers)

export {router as userRoutes}