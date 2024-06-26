import * as db from "../db/index.js"

const getUsers = async (req,res) => {
	try {
		const {rows} = await db.query("SELECT * FROM users;")
		res.json(rows)
	} catch (err) {
		console.log(err)
	}
}

export {getUsers}
