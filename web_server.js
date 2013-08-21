var server = require('express');
	app = server();

app.use(server.static(__dirname + '/public'));
app.use(server.bodyParser());

app.listen(8080);

app.post('/', function(req, res) {
	console.log(req.body.area);
	console.log(req.body.city)
	res.redirect('/homeless.html');
});

console.log('Server listening on port 8080.');

function doSearch(area, city) {
	//zzzz fill this in after you get some sleep
}