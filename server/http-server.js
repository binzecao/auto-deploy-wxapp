var http = require("http");

let startServer = () => {
  http.createServer(function (req, res) {
    console.log('a http request connect: ' + req.url);
    res.write('hello');
    res.end();
  }).listen(8024);

  console.log('listening...');
};

module.exports.start = startServer;