const id = window.location.pathname.split('/')[1]
var $join_btn = $('input#join')
var $endcall_btn = $('input#endcall')
var $mute_btn = $('input#mute')
var $camera_btn = $('input#camera')
var vendorUrl = window.URL || window.webkitURL;
var peer = new Peer({host: location.hostname, port: location.port, path: '/peerjs'})
var mediaConnection = null
var dataConnection = null
var vendorUrl = window.URL || window.webkitURL;
var me = document.getElementById('me');
me.controls = false;
me.muted = true;
var partner = document.getElementById('partner');
partner.controls = false;

(function(){
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
	navigator.getUserMedia({audio: true, video: true}, function(stream){
        window.localStream = stream;
        me.src = vendorUrl.createObjectURL(stream);
	}, function(error){
		alert("Error! Make sure to click allow when asked for permission by the browser");
	});

	$mute_btn.click(() => {
		window.localStream.getAudioTracks()[0].enabled = !(window.localStream.getAudioTracks()[0].enabled);
	})

	$camera_btn.click(() => {
		window.localStream.getVideoTracks()[0].enabled = !(window.localStream.getVideoTracks()[0].enabled);
	})

	$endcall_btn.click(function() {
		console.log('Terminating...');
		if(mediaConnection != null)
			mediaConnection.close();
		if(dataConnection != null)
			dataConnection.close();
	})

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
	
})();

