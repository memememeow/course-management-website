1. How to run the server?
	download every module needed
	mkdir mongo-data
	mongod --dbpath ./mongo-data
	&&
	node server.js
	
	Then open a brower, type in 'local:3000/', then you should see the login page.

2. Ideas and thoughts about server.js
	Static environment and path stuff has been set up. Here is the general work flow
	
	-- User type in browser 'local:3000/sth', functions like "app.route('/sth')"
	gets called, it will first run the sessionChecker (i.e. middleware), in the case 
	of redirect to '/sth2', the 'get(/sth2)' is called... The final goal is to setup session and send the HTML file to the brower.

	-- In the brower, I tried to use a function to ask for a user data.(hard coded data). 	    I think it might be using session instead soon as possible. And then I jsut call my original functions.
	
	-- For the data, try to make some with postman, the 'app.post('/user')' is responsible for creating new users.


3. Try to finish this up soon as possible!! I think I will take some time to work on transition functions!! (Chaning the scene with app.redirect())
