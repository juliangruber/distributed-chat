/**
 * TEH CLIENT.
 *
 * ->
 * ->
 * ->
 * 4) Replicate with server
 * ->
 * 6) Model
 * 7) Message list
 * 8) Message input
 * ->
 * ->
 */

/**
 * Model.
 */

var appendOnly = require('append-only');

var messages = appendOnly();

/**
 * Replicate with server.
 */

var shoe = require('shoe');
var reconnect = require('reconnect');

var re = reconnect(function (connection) {
  connection.pipe(messages.createStream()).pipe(connection);
}).listen('/socket');

document.querySelector('#status').appendChild(re.widget());

/**
 * Message input.
 */

var form = document.querySelector('#input');
var input = form.querySelector('input');

form.addEventListener('submit', function (ev) {
  messages.push({
    msg : input.value
  });

  input.value = '';

  ev.preventDefault();
});

/**
 * Message list.
 */

var sorta = require('sorta');

function compare (a, b) {
  return a - b;
}

var list = sorta({ compare : compare }, function (row) {
  var el = document.createElement('p');
  el.innerText = row.value;
  return el;
});

list.appendTo(document.querySelector('#list'));

messages.on('item', function (item) {
  list.write({
    key : item.__id.split(':')[1],
    value : item.msg
  });
});

/**
 * Debug.
 */

messages.on('item', function(item) {
	console.log(item);
});
