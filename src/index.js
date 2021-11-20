const express = require('express');
var bodyParser = require('body-parser');

const route = require('./routes/route.js');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/', route);
// # Globle Middleware
// task-1
const commonMidleware = function(req, res, next){
	console.log('this is global middleware funcionality')
	// any type of logic  which i have required
	next()
}
app.use( commonMidleware )
const assignMid= function(req, res, next){
	let currentdate = new Date();
	let datetime = currentdate.getDate() + " " +(currentdate.getTime()+1) + " "
					+ currentdate.getUTCFullYear() + " " + currentdate.getHours() + " "
					+ currentdate.getMinutes() + " " + currentdate.getSeconds();

	let ip = req.ip
	let url = req.originalUrl

	console.log(` ${datetime} ${ip} ${url}`)
	next()
}
app.use(assignMid)
const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://users-open-to-all:hiPassword123@cluster0.uh35t.mongodb.net/Rahul_kumarshawDB?retryWrites=true&w=majority", {useNewUrlParser: true})
    .then(() => console.log('mongodb running and connected'))
    .catch(err => console.log(err))


app.listen(process.env.PORT || 3000, function() {
	console.log('Express app running on port ' + (process.env.PORT || 3000))
});