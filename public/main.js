$(function(){
    // attempt to auto-join with the id in pathname
    ConnectToExistingPeer
        .then((dataConnection) => {
            console.log('connection ready! from promise CONSUMPTION');
            if(dataConnection.open){
                console.log('calling peer')

                call_peer(peer_id)
                    .then((call) => {
                        call.on('stream', function(stream) {
                            $("#partner").prop("src", vendorUrl.createObjectURL(stream))
                        })

                        call.on('error', (err) => {
                            console.log(err)
                        })
                    })
                    .catch((call) => {
                        console.log('got nothing')
                        // console.log(call)
                    })
            } else {
                // console.log('init peer');
                // init_peer()
            }
        })
})

var ConnectToExistingPeer = new Promise((resolve, reject) => {
    // var call_id = $('input#callpid').val()
    console.log('Attempt to connect to an existing peer...')    
    console.log(`Connecting to peer : ${peer_id}`)

    init_peer()
    // peer = new Peer({host: location.hostname, port: location.port, path: '/peerjs'})
    dataConnection = peer.connect(peer_id)

    dataConnection.on('open', () => {
        console.log('dataConnection.open');
        resolve(dataConnection)
    })

    dataConnection.on('error', (err) => {
        console.log('error during connection!');
    })

    dataConnection.on('close', () => {
        if(Object.keys(peer.connections).length <= 1){
            peer = null
            init_peer(peer_id)
        } else {

        }
        console.log('connection closed from the other side!');
    })

    // reject()
    console.log(dataConnection)
})

function init_peer(_id=null){
    console.log(`init peer(${_id}) ->`)

    if(!_id) {
        peer = new Peer(peerServerPayload)
    } else {
        peer = new Peer(_id, peerServerPayload)
    }

    peer.on('open', function(peer_id) {
        console.log(`New peer initiated with ID : ${peer_id}`)
        $('#yourpid').empty().html(peer_id)
    })

    peer.on('connect', function(peer_id) {
        console.log('connected! connect event');
    })

    peer.on('connection', function(data){
        console.log(data);
        dataConnection = data
        console.log('connected!')
    })

    peer.on('call', function(call) {
        console.log('Answering a new call...');
        mediaConnection = call

        call.answer(window.localStream);

        call.on('stream', function(stream) {
            $("#partner").prop("src", vendorUrl.createObjectURL(stream));
        });

        call.on('error', (err) => {
            console.log(err)
        })
    });

    peer.on('error', (err) => {
        switch (err.type) {
            case 'peer-unavailable':
                console.log('You are the first joiner!');
                peer = null
                init_peer(peer_id)
                break;
            default:
                console.log(err.type);
                break;
        }
    })
}

function call_peer(peer_id) {
    return new Promise((resolve, reject) => {
        (function waitForAnswer() {
            console.log('still no mediaConnection');
            mediaConnection = peer.call(peer_id, window.localStream)
            if(mediaConnection) { 
                return resolve(mediaConnection)
            } else {
                setTimeout(waitForAnswer, 500)
            }
        })()
    })
}

$endcall_btn.click(function() {
    console.log('Terminating...');
    if(mediaConnection != null)
        mediaConnection.close();
    if(dataConnection != null)
        dataConnection.close();
})