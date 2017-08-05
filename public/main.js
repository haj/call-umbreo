const id = window.location.pathname.split('/')[1]

var $join_btn = $('input#join')
var $endcall_btn = $('input#endcall')
var $mute_btn = $('input#mute')
var $camera_btn = $('input#camera')

var vendorUrl = window.URL || window.webkitURL;
var peer = new Peer({host: location.hostname, port: location.port, path: '/peerjs'})

var mediaConnection = null
var dataConnection = null

peer.on('open', function(peer_id) {
    console.log('My peer ID is: ' + peer_id)
    $('#yourpid').empty().html(peer_id)
})

peer.on('connection', function(data){
    console.log(data);
    dataConnection = data
    console.log('connected!')
})

peer.on('call', function(media) {
    console.log('Answering a new call...');
    mediaConnection = media

    media.answer(window.localStream);

    media.on('stream', function(stream) {
        $("#partner").prop("src", vendorUrl.createObjectURL(stream));
    });

    media.on('error', (err) => {
        console.log(err)
    })
});

peer.on('error', (err) => {
    console.log(err.type)
})

$join_btn.click(function(){
    var call_id = $('input#callpid').val()
    console.log(`Making a Call with ${call_id}`)

    dataConnection = peer.connect(call_id)

    dataConnection.on('open', () => {
        console.log('connection ready!');

        mediaConnection = peer.call(call_id, window.localStream)

        mediaConnection.on('stream', function(stream) {
            $("#partner").prop("src", vendorUrl.createObjectURL(stream))
        })

        mediaConnection.on('error', (err) => {
            console.log(err);
        })
    })

    dataConnection.on('data', (data) => {
        console.log('data received!');
    })
    
    dataConnection.on('error', (err) => {
        console.log('error during connection!');
    })
})

$endcall_btn.click(function() {
    console.log('Terminating...');
    if(mediaConnection != null)
        mediaConnection.close();
    if(dataConnection != null)
        dataConnection.close();
})

$mute_btn.click(() => {
    window.localStream.getAudioTracks()[0].enabled = !(window.localStream.getAudioTracks()[0].enabled);
})

$camera_btn.click(() => {
    window.localStream.getVideoTracks()[0].enabled = !(window.localStream.getVideoTracks()[0].enabled);
})


