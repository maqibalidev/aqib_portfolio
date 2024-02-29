const express = require("express");
require("dotenv").config();
const routes = require("./routes/routes");
const cors = require("cors");

const app = express();
app.use(cors());



const PORT =process.env.PORT || 6010;

app.use(routes);

app.listen(PORT,()=>{
    console.log("server is running");
});
