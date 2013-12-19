var $ = require('elem'),
	Ajax = require('ajax'),
	base64 = require('base64'),
    template = require('./template');


function Login(container,server){
	var self = this;

	if(!container) container = 'login';

	if(typeof container === 'string')
		container = document.getElementById(container);

	if(!container) throw new Error("Login container invalid or missing");

	container.innerHTML = template;

	this.server = server || '';
	this.elem = $(container);
	this.submit = $('#submit',this.elem);
	this.status = $('#status',this.elem);
	this.user = $('#username',this.elem);
	this.pass = $('#password',this.elem);

	$("form", this.elem).on('submit',function(e){
		var method = this.method ? this.method.toLowerCase() : 'get',
			action = this.action.substr(this.action.lastIndexOf('/'),this.action.length);

		e.preventDefault();
		e.stopPropagation();

		this.submit.setAttribute('disabled',true);
	
		self.requestToken(method,action,this.username.value,this.password.value);

		return false;
	});
}

// send authentication request
Login.prototype.requestToken = function(method,action,user,pass){
	var auth, self;

	if(!user || !pass) {
		this.status.text("Enter credentials");
		this.submit.attr('disabled',null);
		return;
	}


	/* base64 url encode username=password */
	auth = base64.encodeURL(user+':'+pass);

	this.status.text("Authenticating");

	Ajax[method](this.server+action+"?"+auth,{timeout:3000}).when(function(res){
		self.status.text("Ok");
		console.log("received token", res.message);
	},function(error){
		error = typeof error === 'object' ? error.message : error;
		self.status.text("Error: " + error);
		self.submit.attr('disabled',null);
	});

}

module.exports = Login;

