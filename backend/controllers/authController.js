import * as db from "../db/index.js"
import { v4 as uuidv4 } from 'uuid';
import bcryptjs from "bcryptjs/dist/bcrypt.js";
import {errorHandler} from "../utils/error.js"
import jwt from "jsonwebtoken"

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

const signin = async (req,res,next) => {

	const {email,password} = req.body;
	const text = "SELECT * FROM users WHERE email = $1;";
	const values = [
		email
	]
	try {
		const {rows} =  await db.query(text,values);
		if(!rows[0]){
			return next(errorHandler(404,'Invalid credentials'))
		}
		const validPassword = bcryptjs.compareSync(password,rows[0].password)
		if(!validPassword){
			return next(errorHandler(401,'Invalid credentials'));
		}
		//Using JSON web tokens to create token to stay signed in
		const token = jwt.sign({id:rows[0].id},process.env.JWT_SECRET);
		//To avoid sending hashed Password to client side
		const {password:hashedPassword,...rest} = rows[0]
		const expiryDate = new Date(Date.now()+3600000)
		res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
	} catch (error) {
		next(error);
	}
 
}

export {signup,signin}