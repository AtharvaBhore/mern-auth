import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import {userRoutes} from "./routes/userRoutes.js"
dotenv.config()

const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use("/users", userRoutes)

app.listen(process.env.PORT,()=>{
    console.log("Listening...")
});