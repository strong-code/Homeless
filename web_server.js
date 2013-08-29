var parser = require('parse-rss');
var server = require('express');
	app = server();
var MongoClient = require('mongodb').MongoClient
    , format = require('util').format; 

//Set up the server
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

//Now set up the DB
MongoClient.connect('mongodb://127.0.0.1:27017/test', function(err, db) {
    if(err) throw err;

    var collection = db.collection('test_insert');
    collection.insert({a:2}, function(err, docs) {

      collection.count(function(err, count) {
        console.log(format("count = %s", count));
      });

      // Locate all the entries using find
      collection.find().toArray(function(err, results) {
        console.dir(results);
        // Let's close the db
        db.close();
      });      
    });
  })

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