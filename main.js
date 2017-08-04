var $ = require('jquery')
var http = require('http')
var express = require('express')
var app = express()

const port = 1330
const host = 'localhost'

app.set('view engine', 'ejs')
app.use('/assets', express.static(__dirname + '/public'))

app.use('/', (req, res) => {
    res.render('index')
})

app.listen(port, host, () => {
    console.log(`Server Started at http://${host}:${port}`)
});