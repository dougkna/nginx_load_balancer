var cluster = require('cluster'),
	express = require('express'),
	app = express(),
	numCPUs = require('os').cpus().length,
	masterPort = process.env.PORT || 2121;

if (cluster.isMaster && numCPUs > 1) {
	var pidToPort = {};
	var worker, port;
	for (var i = 0; i < numCPUs; i++) {
		port = 8000 + i;
		worker = cluster.fork({port: port});
		pidToPort[worker.process.pid] = port;
	}
	app.get('/', function (req, res) {
		res.end('Welcome to Master page.');
	});
	app.listen(masterPort, () => {
		console.log('MASTER listening to port %s...', masterPort);
	});
} else {
	app.set('view engine', 'ejs');
	app.get('/', function (req, res) {
		res.render('home', {pid: process.pid, port: process.env.port});
	});
	app.listen(process.env.port, () => {
		console.log(process.pid + ' listening to port %s...', process.env.port);
	});
}
