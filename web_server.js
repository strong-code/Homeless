var parser = require('parse-rss');
var server = require('express');
	app = server();

app.use(server.static(__dirname + '/public'));
app.use(server.bodyParser());

app.listen(8080);

app.post('/', function(req, res) {
	doSearch(req.body.area, req.body.city)
	res.redirect('/results.html');
});

console.log('Server listening on port 8080.');

function doSearch(area, city) {
	var url = 'http://sfbay.craigslist.org/sfc/apa/index.rss';
	var xmlString = '';
	parser(url, function(err, rss) {
		if (err) {
			console.error(err);
		}
		return parseXML(rss);
	});
}

function parseXML(rss) {
	var listings = [];
	for (i in rss) {
		listings.push(new Listing(rss[i].title, rss[i].pubdate, 
			rss[i].link, rss[i].description));
	}
	//console.log(listings);
}

function Listing(title, pubdate, link, description) {
	this.title = title;
	this.pubdate = pubdate;
	this.link = link;
	this.description = description;
}
