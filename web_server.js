var parser = require('parse-rss');
var server = require('express');
	app = server();

app.use(server.static(__dirname + '/public'));
app.use(server.bodyParser());

app.listen(8080);

app.post('/', function(req, res) {
	try {
		doSearch(buildURL(req.body.area, req.body.city, req.body.query, req.body.pricemin, 
			req.body.pricemax, req.body.rooms, req.body.cat, req.body.dog));
		res.redirect('/results.html');
	} catch (e) {
		console.error(e);
		//should have a dedicated error page or message to user
		res.redirect('/homeless.html');
	}
});

console.log('Server listening on port 8080.');

function doSearch(url) {
	parser(url, function(err, rss) {
		if (err) {
			console.error(err);
		}
		return parseXML(rss);
	});
}

function buildURL(area, city, query, pricemin, pricemax, rooms, cat, dog) {
	var cat = ((cat == undefined) ? '' : '&addTwo=purrr');
	var dog = ((dog == undefined) ? '' : '&addThree=wooof');

	var url = 'http://'+area+'.craigslist.org/search/apa/'+city+'?query='+encodeURIComponent(query)+
	'&zoomToPosting=&srchType=A&minAsk='+pricemin+'&maxAsk='+pricemax+'&bedrooms='+rooms+cat+dog+'&format=rss';

	return url;
}

function parseXML(rss) {
	var listings = [];
	for (i in rss) {
		listings.push(new Listing(rss[i].title, rss[i].pubdate, 
			rss[i].link, rss[i].description));
	}
	console.log(listings);
}

function Listing(title, pubdate, link, description) {
	this.title = title;
	this.pubdate = pubdate;
	this.link = link;
	this.description = description;
}