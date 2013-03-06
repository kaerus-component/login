var Ajax = require('ajax'),
    Hawk = require('hawk'),
    template = require('./template'),
    elm = document.getElementById('login');

elm.innerHTML = template;

var submit = document.getElementById('submit'),
    status = document.getElementById('status'),
    user = document.getElementById('username'),
    pass = document.getElementById('password');

status.text = function(text,append) {
	setText(this,text,append);
}

// form submit handler
document.forms[0].onsubmit = function(e){
	e.preventDefault();

	submit.setAttribute('disabled',true);
	
	requestToken(user.value,pass.value);

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
		status.text("Enter credentials");
		submit.removeAttribute('disabled');
		return;
	}

	if(!Hawk) {
		status.text("Client not loaded");
		return;
	}

	status.text("Authenticating");

	/* dont transmit password in the clear */
	pass = Hawk.crypto.calculateHash(pass,"SHA256");
	/* base64 url encode username=password */
	user = Hawk.crypto.base64urlEncode(user);
	pass = Hawk.crypto.base64urlEncode(pass);

	Ajax.get("Authenticate?"+user+"="+pass,{timeout:5000}).then(function(res){
		status.text("Ok");
		console.log("received token", res.message);
	},function(error){
		status.text("Error: " + error);
		submit.removeAttribute('disabled');
	});
}
