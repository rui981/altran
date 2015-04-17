
var express = require('express');
var router = express.Router();
var mysql      = require('mysql');
var connection      =    mysql.createConnection({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'altran',
    debug    :  false
});

connection.connect(function(err){
if(!err) {
    //console.log("Database is connected ... \n\n");  
} else {
    console.log("Error connecting database ... \n\n");  
}
});


/* GET users listing. */
router.get('/', function(req, res) {
 connection.query('SELECT * from utilizador', function(err, rows, fields) {

  if (!err)
    res.send(rows);
  else
    console.log('Error while performing Query.');
  });


});

module.exports = router;
