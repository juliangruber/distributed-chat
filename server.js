/**
 * TEH SERVER.
 *
 * 1) Webserver
 * 2) Browserify
 * 3) Replicate with client
 * <-
 * 5) Model
 * <-
 * <-
 * <-
 * 9) (Debug)
 * 10) Replicate with other servers
 */

/**
 * Model.
 */

var appendOnly = require('append-only');

var messages = appendOnly();

/**
 * Webserver.
 */

var http = require('http');
var fs = require('fs');
var browserify = require('browserify');

var index = fs.readFileSync(__dirname + '/index.html');

var server = http.createServer(function (req, res) {
  if (req.url == '/') return res.end(index);
  if (req.url == '/script.js') {
    res.writeHead(200, { 'Content-Type' : 'application/javascript'});
    var bundle = browserify(__dirname + '/script.js');
    bundle.bundle().pipe(res);
    return;
  }
  res.end('');
});

/**
 * Replicate with client.
 */

var shoe = require('shoe');

var sock = shoe(function (connection) {
  connection.pipe(messages.createStream()).pipe(connection);
});

sock.install(server, '/socket');

/**
 * Replicate with server.
 */

var net = require('net');
var reconnect = require('reconnect');

net.createServer(function (connection) {
  connection.pipe(messages.createStream()).pipe(connection);
}).listen(Number(process.argv[2]) + 1);

if (process.argv[3]) {
  reconnect(function (connection) {
    connection.pipe(messages.createStream()).pipe(connection);
  }).listen(Number(process.argv[3]) + 1)
}

/**
 * Bind to a port.
 */

server.listen(Number(process.argv[2]));
