/**
 * Example usage
 */
(function(exports){
  "use strict";

  // get the video utils
  var v = exports.video;
  if( !v ) throw new Error('video is not defined');

  var snapshot = document.getElementById('snapshot-holder');

  // Create a new video to stream to
  var video = v.get("#video-stream", config.dims);
  // request access to user's camera
  navigator.getUserMedia = v.getUserMedia();

  if (!navigator.getUserMedia) {
    throw new Error('cannot get user media');
  }

  // Set the video to steam from the camera
  navigator.getUserMedia({video: {
    frameRate: { ideal: 60, max: 60 },
    facingMode: config.facing
  }}, v.stream.bind(video), v.error);

  /**
   * We'll use a countdown timer. When it finishes, take the picture
   */
  function takePicture(){
    // show our camera flash if we want it
    v.flash();
    // take a snapshot of the camera. Pass it the video and optional to pause the video after
    var canvas = v.snapshot(video, true);
    // append our canvas here
    if( snapshot.firstChild )
      snapshot.removeChild(snapshot.firstChild);
    snapshot.appendChild(canvas);
    
  }

  /**
   * We can listen to the timer to take actions
   * @param time
   */
  function onCountdown(time){
    console.info(time);
  }

  // start button to start the countdown
  var startBtn = document.getElementById('start-btn');
  startBtn.addEventListener('click', function(){
    // play the video if it's paused
    video.paused && video.play();
    if( config.countdown ){
      v.countdown(config.countdown_from, onCountdown, takePicture);
    }
  });

})(exports || {});