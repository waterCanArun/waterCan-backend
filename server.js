const express = require("express")
const cors = require('cors')
require('dotenv').config();
const app = express()
const mongoURI = process.env.REACT_APP_MONGODB_URL;
const mongoose = require("mongoose");
const PORT = 9000;
const userRoutes = require('./routes/userRoutes'); 
const routeRoutes = require('./routes/routeRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const customerRoutes = require('./routes/customerRoutes');
const driverRoutes = require('./routes/driverRoutes');
const productRoutes = require('./routes/productRoutes');


app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "*" }))


// async function connectTOMongoDB(uri){
//     try{
//         await mongoose.connect(uri);
//         console.log('Connected To DB');
//     }
//     catch(err){
//         console.log(err.message);
//     }
// }

// connectTOMongoDB(mongoURI)
mongoose.set("strictQuery", false);
mongoose
  .connect(

   `${mongoURI}`
  )
  .then((con) => console.log("connected to remote database"));


app.get("/",(req,res)=>{ res.send("All is well!")
} );

// Use user routes
app.use('/api', userRoutes);

// Use customer routes
app.use('/api', customerRoutes);
app.use('/api', routeRoutes);
app.use('/api', transactionRoutes);
app.use('/api', driverRoutes);
app.use('/api', productRoutes);

app.use("/api/admin",require("./routes/adminRoutes"))




app.listen(PORT, () => {
    console.log("Server is running at", PORT);
});