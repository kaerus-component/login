var Ajax = require('ajax'),
    Hawk = require('hawk');

var template = require('./template');
var elm = document.getElementById('login');

elm.innerHTML = template;

var button_elm = document.getElementById('submit'),
	status_elm = document.getElementById('status'),
	user_elm = document.getElementById('username'),
	pass_elm = document.getElementById('password');

status_elm.text = function(text,append){
	setText(this,text,append);
}

// form submit handler
document.forms[0].onsubmit = function(e){
	e.preventDefault();

	button_elm.setAttribute('disabled',true);
	
	requestToken(user_elm.value,pass_elm.value);
	return false;
}

function setText(elem,text){
	
	while (elem.firstChild) {
 	 	elem.removeChild(elem.firstChild);
	}
		
	elem.appendChild(document.createTextNode(text));
}

// send authentication request
function requestToken(user,pass){

	if(!user || !pass) {
		status_elm.text("Enter credentials");
		button_elm.removeAttribute('disabled');
		return;
	}

	if(!Hawk){
		status_elm.text("Client not loaded");
		return;
	}

	status_elm.text("Authenticating");

	/* dont transmit password in the clear */
	pass = Hawk.crypto.calculateHash(pass,"SHA256");
	/* base64 url encode username=password */
	user = Hawk.crypto.base64urlEncode(user);
	pass = Hawk.crypto.base64urlEncode(pass);

	Ajax.get("Authenticate?"+user+"="+pass,{timeout:5000}).then(function(res){
		status_elm.text("Ok");
		console.log("received token", res.message);
	},function(error){
		status_elm.text("Error: " + error);
		button_elm.removeAttribute('disabled');
	});
}
