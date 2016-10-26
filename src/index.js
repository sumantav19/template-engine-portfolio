const mustache = require("mustache"),
	fs = require("fs"),
	templateReadSync  = fs.readFileSync("./templates/index.temp"),
	jsonDataReadSync = fs.readFileSync("./json/siteMetadata.json")
	



const rawHtml = mustache.to_html("<!--Generated file don't modify-->\n"+templateReadSync.toString(),JSON.parse(jsonDataReadSync));

fs.writeFileSync("./output/index.html", rawHtml.toString());
//process.stdout.write(rawHtml);

