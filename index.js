const server = require("./server/server");

server.listen(process.env.PORT,function(){
 	process.stdout.write("Server listening on port : "+ process.env.PORT);
})