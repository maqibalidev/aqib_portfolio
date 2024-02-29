
const sql = require("mysql");


const connection = sql.createConnection({

host:process.env.HOST,
user:process.env.USER,
password:process.env.PASSWORD,
database:process.env.DB

});

connection.connect((error)=>{

    if (error) {
        console.log("conncection error",error);
    }
else{
    console.log("connected to database");
}

});

module.exports = connection;