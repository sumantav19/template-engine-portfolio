const http =  require("http"),
	fs = require('fs'),
	fsExtra = require('fs-extra'),
	spawnSync = require("child_process").spawnSync,
	formidable = require('formidable'),util = require('util');

const handleRequest = function(request,response){
	response.setHeader('Access-Control-Allow-Origin', '*');
	response.setHeader('Access-Control-Request-Method', '*');
	response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
	response.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, cache-control');
	// console.log(request.url);
	switch (request.url) {
		case '/' :
			fs.readFile('./src/www/index.html',function(err,data){
				if(err){
					response.statusCode = 404;
					response.write(JSON.stringify(err));
					response.end();
				}
				response.statusCode = 200;
				response.write(data);
				response.end();
			});
		break;
		case '/upload':
			var form = new formidable.IncomingForm();
			//form.uploadDir('./output/images');
			form.keepExtensions = true;
			form.parse(request,function(err,fields,files){
				if(err){
					process.stdout.write(err);
					response.statusCode = 404;
					response.write(JSON.stringify(err));
					response.end('upload failed');
				}
				util.inspect({fields:fields,files:files});
			});
			form.on('end',function(fields,files){
				console.log(this.openedFiles[0].path);		
				var temp_path = this.openedFiles[0].path;
				var file_name = this.openedFiles[0].name;	
				fsExtra.copy(temp_path,'./output/images/'+file_name,function(err){
					if(err){
						process.stdout.write(err.toString());
						response.statusCode = 404;
						response.end('upload failed');
					}else{
						fsExtra.remove(temp_path);
						setTimeout(function(){
							response.statusCode = 200;
							response.write(JSON.stringify({ "file" : "images/"+file_name }));
							response.end();	
						}, 2000);
						
					}
				});
			});
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
		case '/getMetadata':
			fs.readFile("./json/siteMetadata.json",function(err,data){
				if(err){
					response.statusCode = 404;
					response.write(JSON.stringify(err));
					response.end();
					return;
				}
				response.statusCode = 200;
				response.write(data);
				response.end();
			});
		break;
		case '/setMetadata' :
			var dataBody = '';
		 	request.on('data',function(chunk){
				dataBody += chunk;
			});
			request.on('end',function(){
				fs.writeFile("./json/siteMetadata.json", dataBody,function(err){
					if(err) return;
						spawnSync('npm',['run','mustache']);
						response.writeHead(200, {'Content-Type': 'text/plain'});
					//	setTimeout(function(){
							response.write("Working fine /");
			 				response.end();
					//	}, 2000);
				});	
			});
		break;
		case'/gitPush' : 
			var gitSpawnShOutput = spawnSync('bash',['debug.sh']);
			if(!gitSpawnShOutput.error){
				response.statusCode = 200;
				response.write(gitSpawnShOutput.output[1]);
				response.end();
			}
			
		break;
		default:
			if( request.url.match(/output/) ){
				var outputFilePath = '.' + request.url;
				fs.readFile(outputFilePath,function(err, data) {
				    if(err){
				    	response.statusCode = 404;
				    	response.write(JSON.stringify(err));
				    	response.end();
				    	return;
				    }
				    response.statusCode = 200;
				    response.write(data);
				    response.end();
				});
				return;
			}
			var filePath = './src/www' + request.url;
			fs.readFile(filePath,function (err,data) {
				// body...
				if(err){
					response.statusCode = 404;
					response.write(JSON.stringify(err));
					response.end();
					return;
				}
				response.statusCode = 200;
				response.write(data);
				response.end();
			});
			// response.end();
	}
};

const server = http.createServer(handleRequest);

module.exports = server;