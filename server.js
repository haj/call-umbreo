var $ = require('jquery')
var http = require('http')
var https = require('https')
var express = require('express')
var fs = require('fs');
var app = express()
var ExpressPeerServer = require('peer').ExpressPeerServer;

const port = process.env.CU_PORT
const host = process.env.CU_HOSTNAME

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/lib'))

var secureCredentials = {
    key: '',
    cert: ''
}

var httpServer = http.createServer(app)
var httpsServer = https.createServer(secureCredentials, app)

var server = httpServer.listen(port, host, () => {
    console.log(`Server Started at http://${host}:${port}`)
});

app.use('/peerjs', ExpressPeerServer(server, {
    debug: true
}));

app.get('/\:id\?', (req, res) => {
    res.render('index', {id: req.params.id})
})