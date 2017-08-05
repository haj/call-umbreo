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