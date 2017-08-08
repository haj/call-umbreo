const peer_id = window.location.pathname.split('/')[1] || null
const peerServerPayload = {host: location.hostname, port: location.port, path: '/peerjs'}
const max_users = 8
var users_count = undefined
var $join_btn = $('input#join')
var $endcall_btn = $('input#endcall')
var $mute_btn = $('input#mute')
var $camera_btn = $('input#camera')
var vendorUrl = window.URL || window.webkitURL;
var mediaConnection = null
var dataConnection = null
var firstJoiner = true
var peer = null
var vendorUrl = window.URL || window.webkitURL;
var me = document.getElementById('me');
me.controls = false;
me.muted = true;
var partner = document.getElementById('partner');
partner.controls = false;

$(function(){
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
});

