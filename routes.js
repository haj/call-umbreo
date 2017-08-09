var express = require('express')
var router = express.Router()
var Call = require('./call')

router.get('/', (req, res) => {
    res.render('index')
})

router.get('/:id', (req, res) => {
    var call = Call.get(req.params.id) || undefined
    if(!call) call = Call.create(req.params.id)
    res.render('call', {id: req.params.id, call: call.toJSON()})
})

router.post('/:id/addpeer/:peerid', (req, res) => {
    var call = Call.get(req.params.id)
    if(!call) return res.status(404).send('Call not found');
    call.addPeer(req.params.peerid)
    console.log(Call.getAll())
    res.json(call.toJSON())
})

router.post('/:id/removepeer/:peerid', (req, res) => {
    var call = Call.get(req.params.id)
    if(!call) return res.status(404).send('Call not found');
    call.removePeer(req.params.peerid)
    console.log(Call.getAll())
    res.json(call.toJSON())
})

module.exports = router