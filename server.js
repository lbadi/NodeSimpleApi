// Import configuration
var config      = require('./config.json');
// Express
var express     = require('express');
// Serve-Static
// var serveStatic = require('serve-static');
// Body-Parser
var bodyParser  = require('body-parser');
// Multer
var multer      = require('multer');
// PostgreSQL
var massive     = require("massive");

//Define variables
var connectionString = "postgres://"+config.postgres.user+":"+config.postgres.password+"@"+config.postgres.host+"/"+config.postgres.db;
var massiveInstance  = massive.connectSync({connectionString : connectionString});
var db;

// Initialize
var app = express();
var startExpress = function() {
  app.listen(config.express.port);
  db = app.get('db');
}
var initialize   = function() {
  startExpress();
}

// Send back a 500 error
var handleError = function(res) {
    return function(err){
        console.log(err)
        res.send(500,{error: err.message});
    }
}

// Retrieve table content
var get = function(request, res, next) {
	var id = request.query.id;
	if (id != null && id>0){
    db.personas.find(id, function(err,dat){
      sys.puts(sys.inspect(dat));
        if (err) {
            handleError(res)
        };
        res.json({ data: dat });
    });
  }
}
// Retrieve all personas TODO: FIX OUT OF MEMORY(40000000 persons)
var list = function(request, res, next) {
  db.personas.find(function(err,dat){
      if (err) {
          handleError(res)
      };
      console.log(dat.data);
      res.json({ data: dat });
  });
}

var males = function(request, res, next) {
  var males;
	db.run("select condact,count(condact) from personas GROUP BY CONDACT", 1, function(err,dat){
    if(err){
      handleError(res)
    }
    res.json({ data : dat})
  //product 1
  });
}


// Express Setup
// Data parsing
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({ extended: true }));
// app.use(multer());
// Define API routes
app.route('/api/personas/get').get(get);
app.route('/api/personas/males').get(males);

// app.route('/api/personas/list').get(list);

// Static files server
// app.use(serveStatic('./public'));
// Set a reference to the massive instance on Express' app:
app.set('db', massiveInstance);
initialize()