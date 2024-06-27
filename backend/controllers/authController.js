import * as db from "../db/index.js"
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from "bcryptjs/dist/bcrypt.js";

const signup = async (req,res,next) => {
	const {email,password,username} = req.body;
	const hashedPassword = bcryptjs.hashSync(password,10)
	const userID = uuidv4()
	const text = "INSERT INTO users( email, password,username) VALUES ($1,$2,$3);"
	const values = [
		email,
		hashedPassword,
		username
	]
	try {
		const respo = await db.query(text,values)
		console.log(respo.rows[0])
		res.status(200).json({msg:"Success"})
	} catch (err) {
		next(err);
	}
}

export {signup}