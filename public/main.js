function rearrangeVideos() {
    if($.trim($('#primary_video_container').html()) == ''){
        var myVideoWindow = $(`#${me.id}`)
        myVideoWindow.detach().appendTo('#primary_video_container')
        myVideoWindow.unbind('click')
        myVideoWindow[0].width = '400'
        myVideoWindow[0].height = '300'
        myVideoWindow[0].load()
        myVideoWindow[0].muted = true
    }
}