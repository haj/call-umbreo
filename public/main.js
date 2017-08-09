function processCall(call){
    // if(window.existingCall)
    //     window.existingCall.close()

    call.on('stream', function(stream) {
        console.log(`Adding video from ${call.peer}`);
        $('#videos').append(`<video id='${call.peer}' width='200' height='200' autoplay></video>`)
        $(`#${call.peer}`).prop("src", vendorUrl.createObjectURL(stream))
        $(`#${call.peer}`).prop("controls", false)
    })

    call.on('close', function(what){
        console.log(`call closed : ${call.peer}`)
        $(`#videos #${call.peer}`).remove()
        unregisterIdWithServer(call.peer)
    })

    call.on('error', (err) => {
        console.log(err)
    })

    window.existingCall = call
}

function endCall() {
    window.existingCall.close()
}

// function publishNews(new_peer) {
//     console.log(`Publish data about ${new_peer}`);
//     if(me.connections) {

//         if(Object.keys(me.connections).length >= 1){
//             for (var key in me.connections) {
//                 if (me.connections.hasOwnProperty(key)) {
//                     var element = me.connections[key]
//                     var d = element[0]
//                     var m = element[1]
//                 }
//             }
//         }

//     }
// }