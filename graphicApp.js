import  express  from 'express'
import  colors  from 'colors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import connectDb from './Config/db.js'
import AuthRoutes from './Routes/AuthRoutes.js'
import CategoryRoutes from './Routes/CategoryRoutes.js'
import ProductRoutes from './Routes/ProductRoutes.js'
import cors from 'cors'
import path from 'path'
import { fileURLToPath} from 'url';

//dotenv configure
dotenv.config()
// dotenv.config({path:'folde name'})

//db config
connectDb();

//esmodule fix
const _filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// rest object
const app = express()

//middelwares
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname,'./graphic/build')));

//routes
app.use("/api/v1/auth", AuthRoutes);
app.use("/api/v1/category", CategoryRoutes);
app.use("/api/v1/product", ProductRoutes)


//rest api
app.use('*',function(req,res){
    res.sendFile(path.join(__dirname, './client/build/index.html'));
});

//port
const PORT = process.env.PORT || 8080;

//run listen
app.listen(PORT, ()=>{
    console.log(`server runing on ${process.env.DEV_MODE} mode on port ${PORT}`.bgCyan.white)
})
