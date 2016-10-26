const http =  require("http"),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	spawn = require("child_process").spawn,
	querystring = require("querystring"),
	formidable = require('formidable'),util = require('util');

const handleRequest = function(request,response){
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control');

	switch (request.url) {
		case '/upload':
			var form = new formidable.IncomingForm();
			//form.uploadDir('./output/images');
			form.keepExtensions = true;
			form.parse(request,function(err,fields,files){
				if(err){
					process.stdout.write(err);
					response.end('upload failed')
				}
				util.inspect({fields:fields,files:files});
			})
			form.on('end',function(fields,files){
				console.log(this.openedFiles[0].path);		
				var temp_path = this.openedFiles[0].path;
				var file_name = this.openedFiles[0].name;	
				fsExtra.copy(temp_path,'./output/images/'+file_name,function(err){
					if(err){
						process.stdout.write(err.toString());
						response.statusCode = 404;
						response.end('upload failed')
					}else{
						fsExtra.remove(temp_path);
						setTimeout(function(){
							response.statusCode = 200;
							response.write(JSON.stringify({ "file" : "images/"+file_name }))
							response.end();	
						}, 2000);
						
					}
				})
			})
		break;
		case '/favicon.ico' : 
			console.log('/favicon.ico');
			response.statusCode = 404;					
			response.end();			
		break;
		case '/delete' : 
			console.log('/delete');
				var dataBody = '';
			 	request.on('data',function(chunk){
					dataBody += chunk;
				});
				request.on('end',function(){
					
					var jsonBody = JSON.parse(dataBody);
					fsExtra.remove('./output/'+jsonBody.data.path,function(err){
						if(err){
							process.stdout.write(err.toString());
							response.statusCode = 404;
							response.write(err.toString());
							response.end();
							return;
						}
						response.statusCode = 200;
						response.write(JSON.stringify({"data" : "File Removed"}));
						response.end();
					});					
					
				});
									
					
		break;
		case '/' :
			var dataBody = '';
		 	request.on('data',function(chunk){
				dataBody += chunk;
			});
			request.on('end',function(){
				fs.writeFile("./json/siteMetadata.json", dataBody,function(err){
					if(err) return;
						spawn('npm',['run','mustache']);
						response.writeHead(200, {'Content-Type': 'text/plain'});
						setTimeout(function(){
							response.write("Working fine /");
			 				response.end();
						}, 2000);
				});	
			});
		break;
	}
}

const server = http.createServer(handleRequest);

exports.server = server;