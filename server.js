var $ = require('jquery')
var http = require('http')
var https = require('https')
var express = require('express')
var fs = require('fs')
var app = express()
var routes = require('./routes')
var bodyParser = require('body-parser')
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

var httpsServer = https.createServer(ssl, app)

var securedServer = httpsServer.listen(port, host, () => {
    console.log(`Server Started at https://${host}:${port}`)
})

app.use('/peerjs', ExpressPeerServer(securedServer, {
    debug: false,
    allow_discovery: true    
}))

app.use(bodyParser.urlencoded({
    extended: true
}))

app.use('/', routes)

// var httpServer = http.createServer(app)
// var server = httpServer.listen(9000, '0.0.0.0', () => {
//     console.log(`Server Started at http://0.0.0.0:9000`)
// })
// app.use('/peerjs', ExpressPeerServer(server, {
//     debug: true,
//     allow_discovery: true
// }))