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

app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode
    })
})

app.listen(process.env.PORT,()=>{
    console.log("Listening...")
});