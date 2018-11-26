const express = require('express');
const fs = require('fs');
const app = express();

let jsonData;
let securitySettingsObj = {};		
retrieveJSON();

app.get("/securitySettings", function(request, response) {
	if (response.statusCode === 200) {
		response.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
		let securitySettings = jsonData.content.securitySettings;
		response.end(JSON.stringify(addFieldsFromSecuritySettings(securitySettings)));
	} else {
		if (response.statusCode === 400) {
			response.writeHead(400, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Bad Request'} }));
		}
		if (response.statusCode === 500) { 
			response.writeHead(500, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Internal Server Error'} }));
		}
	}
});

app.get("/tradingSessions", function(request, response) {
	if (response.statusCode === 200) {
		response.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});  
		response.end(JSON.stringify(jsonData.content.tradingSessions));
	} else {
		if (response.statusCode === 400) {
			response.writeHead(400, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Bad Request'} }));
		}
		if (response.statusCode === 500) { 
			response.writeHead(500, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Internal Server Error'} }));
		}
	}
});

app.get("/allJson", function(request, response) {
	if (response.statusCode === 200) {
		response.writeHead(200, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});  
		response.end(JSON.stringify(jsonData));
	} else {
		if (response.statusCode === 400) {
			response.writeHead(400, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Bad Request'} }));
		}
		if (response.statusCode === 500) { 
			response.writeHead(500, {'Content-Type': 'application/json', "Access-Control-Allow-Origin": "*"});
			response.end(JSON.stringify({error : {statusCode: response.statusCode, statusText: 'Internal Server Error'} }));
		}
	}
});

function retrieveJSON(callback) {
	return fs.readFile('responseFile.json', function(err, data) {
		console.log('start reading');
		if (err) {
			console.log(err.stack);
			return;
		}
		jsonData = JSON.parse(data);
		if (callback) {
			callback(data);
		}
		console.log('File read');
	});
}

function addFieldsFromSecuritySettings(securitySettings) {
	if (Object.keys(securitySettingsObj).length) {
		return securitySettingsObj;
	}

	let countInner = 10;
	let arrayKeys = [];
	let securitySettingsArray = [];
	for (let key in securitySettings) {
		arrayKeys.push(key);
		securitySettingsArray.push(securitySettings[key]);
	}

	for (let i = 0; i < 10; i++) {
		securitySettingsObj[arrayKeys[i]] = securitySettingsArray[i];	
		if (i === 9) {
			let myInterval = setInterval(() => {
				securitySettingsObj[arrayKeys[countInner]] = securitySettingsArray[countInner];
				countInner++;

				if (countInner === securitySettingsArray.length + 1) {
					clearInterval(myInterval);
				}
			}, 5000);
		}
	}
	return securitySettingsObj;
}

app.listen(8099);


