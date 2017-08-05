var $ = require('jquery')
var http = require('http')
var https = require('https')
var express = require('express')
var fs = require('fs')
var app = express()
var ExpressPeerServer = require('peer').ExpressPeerServer

const port = process.env.CU_PORT
const host = process.env.CU_HOSTNAME

app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))
app.use('/assets', express.static(__dirname + '/lib'))

var ssl = {
    key: fs.readFileSync('../callumbreo-key.pem', 'utf8'),
    cert: fs.readFileSync('../callumbreo-cert.pem', 'utf8')
}

var httpServer = http.createServer(app)
var httpsServer = https.createServer(ssl, app)

var server = httpServer.listen(9000, '0.0.0.0', () => {
    console.log(`Server Started at http://0.0.0.0:9000`)
})

var securedServer = httpsServer.listen(port, host, () => {
    console.log(`Server Started at https://${host}:${port}`)
});

app.use('/peerjs', ExpressPeerServer(server, {
    debug: true
}))

app.use('/peerjs', ExpressPeerServer(securedServer, {
    debug: false
}));

app.get('/\:id\?', (req, res) => {
    res.render('index', {id: req.params.id})
})