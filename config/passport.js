
var LocalStrategy = require('passport-local').Strategy;


var User = require('../models/users.js');

module.exports = function(passport){

	passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
	});


	passport.use('local-signup', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	}, 
		function(req, username, password, done){
			process.nextTick(function(){
				User.findOne({'username': username}, function(err, user){
					if(err){
						return done(err);
					}

					if(user){
						return done(null, false, req.flash('signupMessage', 'That email already taken'));
					} else{
						var newUser = new User();
						newUser.username = username;
						newUser.password = password;

						newUser.save(function(err){
							if(err)
								throw err;
							return done(null, newUser);
						})
					}
				})
			})
		}
	))


	passport.use('local-login', new LocalStrategy({
		usernameField: 'username',
		passwordField: 'password',
		passReqToCallback: true
	},
		function(req, username, password, done){
			process.nextTick(function(){
				User.findOne({username:username}, function(err, user){
					if(err)
						return done(err);

					if(!user)
						return null, false, req.flash('localMessage', 'No User found.');
					if(user.password != password)
						return done(null, false, req.flash('loginMessage', 'invalid password'));
					return done(null, user);
				})
			})
		}
	))



}