var $ = require('jquery')
var http = require('http')
var express = require('express')
var app = express()
var ExpressPeerServer = require('peer').ExpressPeerServer;

const port = 9000
const host = 'localhost'

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/lib'))

var server = app.listen(port, host, () => {
    console.log(`Server Started at http://${host}:${port}`)
});

app.use('/peerjs', ExpressPeerServer(server, {
    debug: true
}));

app.get('/\:id\?', (req, res) => {
    res.render('index', {id: req.params.id})
})

// server.on('connection', function(conn) { 
//   conn.on('data', function(data){
//     // Will print 'hi!'
//     console.log(data.toString());
//   });
// });

// server.on('disconnect', function(id) { 
//     console.log('Disconnected!');
// });