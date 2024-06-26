import pg from "pg"
const {Pool} = pg
import dotenv from "dotenv"
dotenv.config()

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
})

export const query = (text, params) => {
	return pool.query(text, params)
}
