import * as db from "../db/index.js"
import {errorHandler} from "../utils/error.js"
import bcryptjs from 'bcryptjs'

const getUsers = async (req,res) => {
	try {
		const {rows} = await db.query("SELECT * FROM users;")
		res.json(rows)
	} catch (err) {
		console.log(err)
	}
}

const updateUser = async (req,res,next) => {

	const id = req.params.id;
	const text = "SELECT * FROM users WHERE id = $1;";
	const values = [
		id
	]

	if (req.user.id !== req.params.id){
		return next(errorHandler(401,'You can update only your account!'))
	}

	try {
		if(req.body.password){
			req.body.password = bcryptjs.hashSync(req.body.password,10);
		}

		let {rows} =  await db.query(text,values);

		const text1 = "UPDATE users SET username = $1,email = $2, password = $3,profileimage=$4 WHERE id = $5 RETURNING *;"
		const values1 = [
			req.body.username || rows[0].username,
			req.body.email || rows[0].email,
			req.body.password || rows[0].password,
			req.body.profilePicture || rows[0].profileimage,
			req.params.id
		]

		const respo = await db.query(text1,values1)

		const {password:hashedPassword,...rest} = respo.rows[0]
		res.status(200).json(rest);

	} catch (error) {
		next(error);
	}

}

export {getUsers,updateUser}
