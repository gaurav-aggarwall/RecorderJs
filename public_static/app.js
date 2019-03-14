//webkitURL is deprecated but nevertheless
URL = window.URL || window.webkitURL;
// var link = document.createElement('a');
var gumStream; 						//stream from getUserMedia()
var rec; 							//Recorder.js object
var input; 							//MediaStreamAudioSourceNode we'll be recording

// shim for AudioContext when it's not avb. 
var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext; //audio context to help us record

var recordButton = document.getElementById("recordButton");
var stopButton = document.getElementById("stopButton");
var pauseButton = document.getElementById("pauseButton");
var sendButton = document.getElementById("sendBtn");
var saveSound = document.getElementById('saveSound');
var ol = document.getElementById('ol');

//add events to those 2 buttons
recordButton.addEventListener("click", startRecording);
stopButton.addEventListener("click", stopRecording);
pauseButton.addEventListener("click", pauseRecording);
sendButton.addEventListener("click", sendRecording);

function startRecording() {
	console.log("recordButton clicked");    
	var constraints = { audio: true, video: false };
	
	recordButton.disabled = true;
	stopButton.disabled = false;
	pauseButton.disabled = false;
	sendBtn.disabled=false;
	navigator.mediaDevices.getUserMedia(constraints).then(function(stream) {
		console.log("getUserMedia() success, stream created, initializing Recorder.js ...");
	
		audioContext = new AudioContext();
		gumStream = stream;
		
		/* use the stream */
		input = audioContext.createMediaStreamSource(stream);
		rec = new Recorder(input,{numChannels:1})

		//start the recording process
		rec.record()

		console.log("Recording started");

	}).catch(function(err) {
    	recordButton.disabled = false;
    	stopButton.disabled = true;
		pauseButton.disabled = true;
	});
}

function pauseRecording(){
	console.log("pauseButton clicked rec.recording=",rec.recording );
	if (rec.recording){
		//pause
		rec.stop();
		pauseButton.innerHTML="Resume";
	}else{
		//resume
		rec.record()
		pauseButton.innerHTML="Pause";

	}
}

function stopRecording() {
	console.log("stopButton clicked");
	stopButton.disabled = true;
	recordButton.disabled = false;
	pauseButton.disabled = true;
	pauseButton.innerHTML="Pause";
	rec.stop();
}

function sendRecording(){
	gumStream.getAudioTracks()[0].stop();
	rec.exportWAV(saveToServer);
}

function saveToServer(blob) {
	
	var url = URL.createObjectURL(blob);

	createLink(url);

	var file = new File([blob], "sound.wav");
	saveSound.href = url;
	saveSound.download = 'sound.wav'; 
		var formData = new FormData()
      formData.append("audio", file);

      console.log('File : '+ file);
      console.log('Form Data : '+ formData);

		$.ajax({
			url: "/downloadWAV",
			method: "POST",
			data: formData,
			processData: false,
			contentType: false,
			success: function () {
				console.log('File Downloaded');
			}
		  })	
}

function createLink(url){
	
	var li = document.createElement('li');
	var au = document.createElement('audio');

	au.controls = true;
	au.src = url;
	li.appendChild(au);
	ol.appendChild(li);
}
