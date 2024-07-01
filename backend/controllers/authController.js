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

const google = async(req,res,next)=>{

	const email = req.body.email;
	const text = "SELECT * FROM users WHERE email = $1;";
	const values = [
		email
	]

	try {
		
		const {rows} =  await db.query(text,values);
		if(rows[0]){
			const token = jwt.sign({id:rows[0].id},process.env.JWT_SECRET);
			const {password:hashedPassword,...rest} = rows[0]
			const expiryDate = new Date(Date.now()+3600000)
			res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
		}else{
			const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
			const hPassword = bcryptjs.hashSync(generatedPassword,10);
			const username = req.body.name.split(' ').join('').toLowerCase()+Math.floor(Math.random()*10000).toString();
			const email = req.body.email;
			const profilePhoto = req.body.photo;
			const password=hPassword;
			const userID = uuidv4()
			const text = "INSERT INTO users( email, password,username,profileimage) VALUES ($1,$2,$3,$4);"
			const values = [
				email,
				password,
				username,
				profilePhoto,
			]
			const respo = await db.query(text,values)
			const token = jwt.sign({id:respo[0].id},process.env.JWT_SECRET);
			const {password:hashedPassword,...rest} = respo[0]
			const expiryDate = new Date(Date.now()+3600000)
			res.cookie('access_token',token,{httpOnly:true,expires:expiryDate}).status(200).json(rest);
		}

	} catch (error) {
		console.log(error);
	}

}

const signout = async (req,res,next) =>{
	res.clearCookie('access_token').status(200).json('Signout success!');
}

export {signup,signin,google,signout}