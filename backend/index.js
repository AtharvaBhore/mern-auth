import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { userRoutes} from "./routes/userRoutes.js"
import { authRoutes} from "./routes/authRoutes.js"

const app = express()

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))

app.use("/users", userRoutes)

app.use("/auth", authRoutes)

app.use("/gg", (req,res)=>{
    res.send('gg');
})

app.listen(process.env.PORT,()=>{
    console.log("Listening...")
});