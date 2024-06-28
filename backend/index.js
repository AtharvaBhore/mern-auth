import express from "express"
import bodyParser from "body-parser"
import dotenv from "dotenv"
import { userRoutes} from "./routes/userRoutes.js"
import { authRoutes} from "./routes/authRoutes.js"
import cors from "cors"

const app = express()

app.use(bodyParser.json())
//app.use(bodyParser.urlencoded({extended: true}))
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your client's domain
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
    optionsSuccessStatus: 204 // For legacy browser support
  }));

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