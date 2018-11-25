const http = require('http');
const express = require('express');
const fs = require('fs');

const app = express();

let counter = 0;
let content;

app.get("/securitySettings", function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", '*'); 
	const data = retrieveJSON((function (err, content) {
		let obj = JSON.parse(content);
		response.send(obj.content.securitySettings);
	}));
});

app.get("/tradingSessions", function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", '*');    
	const data = retrieveJSON((function (err, content) {
		let obj = JSON.parse(content);
		response.send(obj.content.tradingSessions);
	}));
});

app.get("/allJson", function(request, response) {
	response.setHeader("Access-Control-Allow-Origin", '*');    
	const data = retrieveJSON((function (err, content) {
		let obj = JSON.parse(content);
		response.send(obj);
	}));
});

function sendStatus(res) {
	res.status(200).send('OK');
	res.status(400).send('Bad Request');
	res.status(404).send('Not Found');
	res.status(500).send('Internal Server Error');
}


function retrieveJSON(callback) {
	return fs.readFile('responseFile.json', function(err, data) {
		console.log('start reading');
		if (err) {
			console.log(err.stack);
			return;
		}
		callback(null, data);
		console.log('File read');
	});
}

app.listen(8099);


