var vendorUrl = window.URL || window.webkitURL;

var me = document.getElementById('me');
me.controls = false;

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
})();