var uuid = require('uuid')
var calls = []

class Call {
    constructor() {
        this.id = uuid.v1()
        this.started = Date.now()
        this.peers = []
    }

    toJSON() {
        return {id: this.id, started: this.started, peers: this.peers}
    }

    addPeer(peerId) {
        this.peers.push(peerId)
    }

    removePeer(peerId) {
        var index = this.peers.lastIndexOf(peerId)
        if (index !== -1) this.peers.splice(index, 1)
    }
}

Call.create = (id) => {
    var call = new Call()
    call.id = id
    calls.push(call)
    return call
}

Call.get = (id) => {
  return (calls.filter(function(call) {
    return id === call.id
  }) || [])[0]
}

Call.getAll = () => {
  return calls
}

module.exports = Call