var express = require('express');
var app = express();
var countries = require('country-list')();
var path = require('path');

app.use(express.static(__dirname + '/app'));    

app.get('/api/country', function(req, res) {  
	res.json(countries.getNames());
});

// All other routes should redirect to the index.html
app.set('appPath', 'app');
app.use(express.static(__dirname +'/'));

app.route('/*')
.get(function(req, res) {
  res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
});

app.listen(8080, function() {  
    console.log('App listening on port 8080');
});




