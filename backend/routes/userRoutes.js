import verify  from "jsonwebtoken"
import {getUsers,updateUser} from "../controllers/userController.js"
import express from "express"
import {verifyToken} from '../utils/verifyUser.js'
import { update } from "firebase/database"

const router = express.Router()

router.get("/all", getUsers)
router.post('/update/:id',verifyToken,updateUser)

export {router as userRoutes}