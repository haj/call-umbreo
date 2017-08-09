navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia
const peer_id = window.location.pathname.split('/')[1] || null
const peerServerPayload = {host: location.hostname, port: location.port, path: '/peerjs'}
const max_users = 8
var users_count = undefined
var $join_btn = $('input#join')
var $sharescreen_btn = $('input#sharescreen')
var $mute_btn = $('input#mute')
var $camera_btn = $('input#camera')
var vendorUrl = window.URL || window.webkitURL
var mediaConnection = null
var dataConnection = null
var firstJoiner = true
var peer = null
var vendorUrl = window.URL || window.webkitURL
var primaryVideo = $('#primary_video_container video')
primaryVideo.attr('controls', false)

var me = {}
var peers = {}

$(function (){
  if (!navigator.getUserMedia) return unsupported()

  getLocalAudioStream(function(err, stream) {
    if (err || !stream) return

		init_peer(function(err, me) {

			if(err) return
			registerIdWithServer()
			call.peers.forEach((peer) => {
				callPeerIfExist(peer, function(err, conn){

				})
			})
			if(!peers.length) displayShareMessage()
		})
	})
})

function init_peer(cb){
    me = new Peer(peerServerPayload)

    me.on('open', function(peer_id) {
      console.log(`New peer initiated with ID : ${peer_id}`)
			$('#yourpid').empty().html(peer_id)
			primaryVideo.attr('id', me.id)
			cb && cb(null, me)
    })

    me.on('connection', function(data){
        console.log(data);
        dataConnection = data
        console.log('connected!')
    })

    me.on('close', function(what){
        unregisterIdWithServer(me.id)
    })

		me.on('disconnected', function(what) {
			unregisterIdWithServer(me.id)
		})

    me.on('call', function(call) {
        console.log('Answering a new call...')
        mediaConnection = call
				call.answer(window.localStream)
        processCall(call)
    })

    me.on('error', (err) => {
			switch (err.type) {
			case 'peer-unavailable':
				console.log("The peer you are trying to connect doesn't exist")
				var words = err.message.split(' ')
				var id = words[words.length - 1]
				unregisterIdWithServer(id)
				break;
			default:
				console.log(err.type)
				break;
			}
		cb && cb(err)
    })
}

function processCall(call){
    call.on('stream', function(stream) {
			display(`Connected to ${call.peer}`)
			addIncomingStream(call, stream)
    })

    call.on('close', function(){
			console.log(`call closed : ${call.peer}`)
			$(`#${call.peer}`).remove()
			rearrangeVideos()
			unregisterIdWithServer(call.peer)
    })

    call.on('error', (err) => {
			console.log(err)
			display(err)
    })
}

$(function(){
	$mute_btn.click(() => {
		window.localStream.getAudioTracks()[0].enabled = !(window.localStream.getAudioTracks()[0].enabled)
		if(window.localStream.getAudioTracks()[0].enabled)
			$mute_btn.val() == 'mute'
		else
			$mute_btn.val() == 'unmute'
	})

	$camera_btn.click(() => {
		window.localStream.getVideoTracks()[0].enabled = !(window.localStream.getVideoTracks()[0].enabled)
	})

	$join_btn.click(() => {
		location.href = location.href + '/' + $("input#room_name").val()
	})

	$sharescreen_btn.click(function() {
		
	})
})

function callPeer(peerId) {
  display(`Calling ${peerId} ...`);
  var peer = getPeer(peerId)
  peer.outgoing = me.call(peerId, window.localStream)
  processCall(peer.outgoing)
}

function addIncomingStream(call, stream) {
	display('Adding incoming stream from ' + call.peer)
	var peer = getPeer(call.peer)
  peer.incomingStream = stream
  playStream(stream, call.peer)
}

function playStream(stream, call_peer) {
  var video = $(`<video width='200' height='200' autoplay />`).appendTo('#videos');
  video[0].src = vendorUrl.createObjectURL(stream)
	video[0].id = call_peer
	$(video).click(() => {
		var id = video[0].id
		var src = video[0].src
		var primary = $('#primary_video_container video')[0]
		video[0].src = primary.src
		video[0].id = primary.id
		primary.id = id
		primary.src = src
		rearrangeVideos()
		// primary.load()
		// video[0].load()
	})		
}

function getPeer(peerId) {
  return peers[peerId] || (peers[peerId] = {id: peerId})
}

function registerIdWithServer() {
	$.post(`/${peer_id}/addpeer/${me.id}`)
}

function unregisterIdWithServer(id) {
	$.post(`/${peer_id}/removepeer/${id}`)
}

function callPeerIfExist(peer, cb) {
	var conn = me.connect(peer)
	conn.on('open', () => {
		console.log(`${peer} exists! Calling...`)
		callPeer(peer)
		cb && cb(null, conn)
	})
	conn.on('error', (err) => {
		console.log(`Error while trying to connect to ${peer}`)
		console.log(err)
		cb && cb(err)
	})
	conn.on('close', () => {
		console.log(`Close event while trying to connect to ${peer}`)
		$(`#${peer}`).remove()
	})
}

function cleanServerPeers() {
	console.log('unwanted peers');
	$(call.peers).not(Object.keys(peers)).get().forEach(function(element) {
		console.log(element)
		unregisterIdWithServer(element)
	}, this);
}

function unsupported() {
  display("Your browser doesn't support getUserMedia.");
}

function displayShareMessage() {
  display('Give someone this URL to chat.');
  display(`<input type='text' value='${location.href}' readonly>`);
  
  $('#display input').click(function() {
    this.select();
  });
}

function display(message) {
  $('<div />').html(message).appendTo('#display');
}

function getLocalAudioStream(cb) {
	navigator.getUserMedia({audio: true, video: true}, function(stream){
    window.localStream = stream
		primaryVideo.attr('src', vendorUrl.createObjectURL(stream))
		// primaryVideo.attr('muted', true)
		if(cb) cb(null, stream)
	}, function(error){
		alert("Error! Make sure to click allow when asked for permission by the browser")
		if(cb) cb(error)
	})
}

// var ConnectToExistingPeer = new Promise((resolve, reject) => {
//     // var call_id = $('input#callpid').val()
//     console.log('Attempt to connect to an existing peer...')    
//     console.log(`Connecting to peer : ${peer_id}`)

//     init_peer()
//     dataConnection = me.connect(peer_id)

//     dataConnection.on('open', () => {
//         console.log('dataConnection.open');
//         resolve(dataConnection)
//     })

//     dataConnection.on('error', (err) => {
//         console.log('error during connection!');
//     })

//     dataConnection.on('close', () => {
//         if(Object.keys(me.connections).length <= 1){
//             me = {}
//             init_peer(peer_id)
//         } else {

//         }
//         console.log('connection closed from the other side!');
//     })

//     dataConnection.on('data', function(data) {
//         console.log('New peer detected')
//         console.log(data)
//         // if(data.constructor == MediaConnection){
//             // console.log(`New peer detected ${data.peer}`)
//             // console.log(`Stream : ${data.remoteStream}`)
//         // }
//     })

//     // console.log(dataConnection)
// })