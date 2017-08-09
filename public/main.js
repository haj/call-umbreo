


$(function() {
    console.log('ready!')
})

function rearrangeVideos() {

    if($.trim($('#primary_video_container').html()) == ''){
        console.log('moving...')
        $(`#${me.id}`).detach().appendTo('#primary_video_container')
        $(`#${me.id}`)[0].width = '400'
        $(`#${me.id}`)[0].height = '300'
        $(`#${me.id}`).unbind('click')
    }

    // $(`#${me.id}`)[0].muted = true
    $.each($(`video[id!='${me.id}']`), (i, val) => {
        // val.load()
        // val.muted = false
    })
}