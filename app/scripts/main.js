(function(exports){

  var v = exports.video;
  if( !v ) throw new Error('video is not defined');

  var video = v.get("#video-stream", config.dims);
  navigator.getUserMedia = v.getUserMedia();

  if (!navigator.getUserMedia) {
    throw new Error('cannot get user media');
  }

  navigator.getUserMedia({video: {
    frameRate: { ideal: 60, max: 60 } ,
    //facingMode: config.facing
  }}, v.stream.bind(video), v.error);

  function takePicture(){
    console.log('aw snap');
    v.flash();
    var canvas = v.snapshot(video, true);
    console.log(canvas);

    document.body.appendChild(canvas);
  }

  function onCountdown(time){
    console.log(time);
  }

  var startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', function(){
    video.paused && video.play();
    if( config.countdown ){
      v.countdown(config.countdown_from, onCountdown, takePicture);
    }

  });

})(exports || {});