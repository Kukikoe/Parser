window.addEventListener("load", function() {
	init();
});

function init() {
	addEventListeners();
}

function addEventListeners() {
	const btnGetSecuritySettingsElem = document.getElementById("btn-get-security-settings");
	const btnGetTradingSessionsElem = document.getElementById("btn-get-trading-sessions");
	const btnGetInfoFromAllJsonElem = document.getElementById("btn-get-info-from-all-json");
	const mainBlockElem = document.querySelector(".main-block");

	btnGetSecuritySettingsElem.addEventListener("click", function() {
		clearMainBlock(mainBlockElem);
		createTable(mainBlockElem, "Security Settings");
		addClassForTable(document.querySelector(".main-block__table"));
		createRequest('http://localhost:8099/securitySettings');
	});

	btnGetTradingSessionsElem.addEventListener("click", function() {
		clearMainBlock(mainBlockElem);
		createTable(mainBlockElem, "Trading Sessions");
		addClassForTable(document.querySelector(".main-block__table"));
		createRequest('http://localhost:8099/tradingSessions');
	});

	btnGetInfoFromAllJsonElem.addEventListener("click", function() {
		clearMainBlock(mainBlockElem);
		createRequest('http://localhost:8099/allJson');
	});
}

function createRequest(url) {
	var xhr = new XMLHttpRequest();
	xhr.responseType = 'json';
	xhr.open('GET', url, true);

	xhr.onload = function() {
		console.log(this.status)
		let jsonResponse = this.response;
		if (url === 'http://localhost:8099/tradingSessions') {
			getTradingSession(jsonResponse);
		} 
		if (url === 'http://localhost:8099/securitySettings') {
			getSecuritySettings(jsonResponse);
		}
		if (url === 'http://localhost:8099/allJson') {
			let str = JSON.stringify(jsonResponse, undefined, 4);			
			document.querySelector(".info-block").innerHTML = syntaxHighlight(str);
		}
	}
	xhr.send(null);
}

function getSecuritySettings(jsonResponse) {
	getTheadForSecuritySettings(jsonResponse); 
	let array = [];

	for (var key in jsonResponse) {
		array.push(key);
		for(var key2 in jsonResponse[key]) {		
			array.push(jsonResponse[key][key2]);
		}
		addInfoAboutSecuritySettingsInTable(array);
		array = [];
	}
}

function getTradingSession(jsonResponse) {
	let count = 0;

	for (var key in jsonResponse) {
		for (var key2 in jsonResponse[key]) {
			if (count !== 0) continue;
			getTheadForTradingSessions(jsonResponse[key][key2]);
			count++; 
		}
	}
	let array = [];

	for (var key in jsonResponse) {
		for(var key2 in jsonResponse[key]) {
			array.push(jsonResponse[key][key2]);
		}
		addInfoAboutTradingSessionsInTable(key, array);
		array = [];
	}
}

function addInfoAboutTradingSessionsInTable(tradingSessionName, array) {
	let tr = document.createElement("tr");
	let td = document.createElement("td");
	td.rowSpan = array.length + 1;
	td.innerHTML = tradingSessionName;
	tr.appendChild(td);
	document.querySelector(".main-block__tbody").appendChild(tr);
	for (let i = 0; i < array.length; i++) {
		let tr = document.createElement("tr");
		let td = document.createElement("td");
		td.innerHTML = i;
		tr.appendChild(td);
		for (let key in array[i]) {
			let td = document.createElement("td");
			td.innerHTML = array[i][key];
			tr.appendChild(td);
			document.querySelector(".main-block__tbody").appendChild(tr);
		}
	}	
}

function addClassForTable(tableElem) {
	tableElem.classList.add("active");
}

function deleteTable(tableElem) {
	tableElem.classList.add("active");
}

function getTheadForTradingSessions(obj) {
	let tr = document.createElement("tr");
	addTheadInTable(tr, "Trading Session");
	addTheadInTable(tr, "id");
	for (var key in obj) {	
		addTheadInTable(tr, key);	
	}
	document.querySelector(".main-block__thead").appendChild(tr);
}

function getTheadForSecuritySettings(obj) {
	let count = 0;
	let tr = document.createElement("tr");
	addTheadInTable(tr, "id");
	for (var key in obj) {
		if (count !== 0) continue;
		for(var key2 in obj[key]) {
			if (count === 0) {
				addTheadInTable(tr, key2);	
			}
		}
		count++;
	}
	document.querySelector(".main-block__thead").appendChild(tr);
}

function addTheadInTable(tr, string) {
	let th = document.createElement("th");
	th.innerHTML = string;
	tr.appendChild(th);
}

function addInfoAboutSecuritySettingsInTable(array) {
	let tr = document.createElement("tr");
	for (let i = 0; i < array.length; i++) {
		let td = document.createElement("td");
		td.innerHTML = array[i];
		tr.appendChild(td);
	}
	document.querySelector(".main-block__tbody").appendChild(tr);
}

function createTable(mainBlockElem, captionText) {
	let table = document.createElement("table");
	table.className = "main-block__table";
	let caption = document.createElement("caption");
	caption.innerHTML = captionText;
	let thead = document.createElement("thead");
	thead.className = "main-block__thead";
	let tbody = document.createElement("tbody");
	tbody.className = "main-block__tbody";
	table.appendChild(caption);
	table.appendChild(thead);
	table.appendChild(tbody);
	mainBlockElem.appendChild(table);
}

function clearMainBlock(mainBlockElem) {
	mainBlockElem.innerHTML = '';
	document.querySelector(".info-block").innerHTML = '';
}

function syntaxHighlight(json) {
    if (typeof json != 'string') {
         json = JSON.stringify(json, undefined, 2);
    }
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
        var cls = 'number';
        if (/^"/.test(match)) {
            if (/:$/.test(match)) {
                cls = 'key';
            } else {
                cls = 'string';
            }
        } else if (/true|false/.test(match)) {
            cls = 'boolean';
        } else if (/null/.test(match)) {
            cls = 'null';
        }
        return '<span class="' + cls + '">' + match + '</span>';
    });
}
