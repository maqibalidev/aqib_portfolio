
const sql = require("mysql");


const connection = sql.createConnection({

host:"aqibportfolio.42web.io",
user:"if0_36071557",
password:"PEq4HHaOdaEi",
database:"if0_36071557_portfolio"

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