var port = 8025;
var io = require('socket.io')(port);

var connectCount = 0;

io.on('connection', function (socket) {
  /*
  socket.emit('request', ); // emit an event to the socket
  io.emit('broadcast', ); // emit an event to all connected sockets
  socket.on('reply', function () { }); // listen to the event
  */

  /*
  connectCount++;
  socket.emit('sync msg', {
    msg: `welcome user${connectCount}!`
  });

  socket.on('user msg', function (data) {
    console.log(data);
    io.emit('sync msg', {
      msg: data.msg
    });
  });

  socket.on('disconnect', function (data) {
    //connectCount--;
    io.emit('sync msg', {
      msg: 'some one has leaved...'
    });
  });
  */

  connectCount++;
  io.emit('msg', {
    msg: `welcome user${connectCount}`
  });

  socket.on('msg', function (data) {
    console.log(data);
    io.emit('msg', {
      msg: data.msg
    });
  });

  socket.on('disconnect', function (data) {
    //connectCount--;
    io.emit('msg', {
      msg: 'some one has leaved...'
    });
  });
});
console.log('listen :' + port);