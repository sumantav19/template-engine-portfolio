const gulp = require("gulp"),
 	spawn = require("child_process").spawn,
 	serve = require("gulp-serve"),
 	server = require("./server/server").server;
 	

gulp.task("mustache",function(){
	spawn('node',['./src/index.js'])
})

gulp.task("remotegitpush",function(){
 	spawn('bash',['debug.sh']);	
})

gulp.task("httppost",function(){
	// const http =  require("http"),fs = require("fs"),
	// 	querystring = require('querystring'),
	// 	url = require('url'),urlPath = "",
	// handleRequest = function(request,response){
	// 	//urlPath = url.parse(request.url).href;		
	// 	//Headers for Cors
	// 	response.setHeader('Access-Control-Allow-Origin', '*');
	// 	response.setHeader('Access-Control-Request-Method', '*');
	// 	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	// 	response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control');

	// 	var dataBody = '';
	// 	request.on('data',function(chunk){
	// 		dataBody += chunk;
	// 	})
	// 	//var query = querystring.parse(url.parse(request.url).query);

	// 		
	// 		form.parse(request,function(err,fields,files){
	// 					console.log(files.file);
	// 				})
	// 		switch(url.parse(request.url).href){
	// 			case '/upload':
	// 				//upload.single('file');
	// 				//fs.writeFileSync('./output/images/temp', dataBody);
	// 				 console.log('/upload');
	// 				// console.log(querystring.parse(dataBody,'\n'));

	// 				response.write("Working fine upload");
	// 		 		response.end();
	// 				break;
	// 			case '/favicon.ico' :
	// 				console.log('/favicon.ico');
	// 				response.writeHead(404);					r
	// 		 		response.end();
	// 				break;
	// 			case '/' :
	// 				fs.writeFile("./json/siteMetadata.json", dataBody,function(err){
	// 					if(err) return;
	// 					spawn('npm',['run','mustache']);
	// 					response.writeHead(200, {'Content-Type': 'text/plain'});
	// 					setTimeout(function(){
	// 						response.write("Working fine /");
	// 		 				response.end();
	// 					}, 2000);
	// 				});					
	// 				break;
	// 			default:
	// 				console.log('/');
	// 				response.write("Working fine /default");
	// 		 		response.end();
	// 		}
	// 		// fs.writeFile("./json/siteMetadata.json", dataBody,function(err){
	// 		// 	if(err) return;
	// 		// 	spawn('npm',['run','mustache']);
	// 		// response.writeHead(200, {'Content-Type': 'text/plain'});
	// 		// 	setTimeout(function(){
				
	// 		// 	}, 2000);
	// 		//	});
			 
	// 	})
	// // var username = querystring.parse(url.parse(request.url).query)['username'];
	// // var email = querystring.parse(url.parse(request.url).query)['email'];
	
	// // response.write("Hello "+ username + " you are registered with email id "+ email );
	// // response.end();
	// };
	// var server = http.createServer(handleRequest);

	server.listen(4000,function(){
	 	console.log("Server listening on port : "+ 4000);
	})
	
})

gulp.task("serve",['httppost'],serve(['src/www','../template-engine']))