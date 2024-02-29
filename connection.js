
const sql = require("mysql");


const connection = sql.createConnection({

host:"aqibproject.000webhostapp.com",
user:"id19662667_aqibak786",
password:"Aqib@ak786",
database:"id19662667_myportfolio"

});

connection.connect((error)=>{

    if (error) {
        console.log("conncection error");
    }
else{
    console.log("connected to database");
}

});

module.exports = connection;