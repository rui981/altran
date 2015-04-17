var express    = require("express");
var mysql      = require('mysql');
var path = require('path');
var routes = require('./routes/index');
var users = require('./routes/users');
var user = require('./routes/user');




var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

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
    console.log("Database is connected ... \n\n");  
} else {
    console.log("Error connecting database ... \n\n");  
}
});



app.use('/', routes);
app.use('/user', user);
app.use('/users', users);










app.listen(3000);
