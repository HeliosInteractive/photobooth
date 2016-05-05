(function(exports) {
  "use strict";

  var video = {};

  /**
   * Create object with id
   * @param {string} el html element
   * @param {string} id id
   * @returns {Element}
   */
  function createObjId(el, id){
    var obj = document.createElement(el);
    obj.setAttribute('id', id);
    return obj;
  }
  /**
   * Create our video object
   * @returns {Element}
   */
  function createVideo(){
    var obj = createObjId('video', 'video-stream');
    obj.autoplay = true;
    obj.src = '';
    return obj;
  }
  /**
   * Create cowndown element
   * @returns {Element}
   */
  function createCountdown(){
    var c = createObjId('div', 'countdown-container');
    c.setAttribute('class', 'hidden');
    return c;
  }

  var container = document.getElementById('video-container');

  if( !container )
    throw new Error('create html element #video-container to use photobooth');

  var countdown = createCountdown();
  var countdownDisplay = createObjId('h1', 'countdown-display');
  var flash = createObjId('div', 'camera-flash');

  // put it all in the dom
  container.appendChild(createVideo());
  container.appendChild(flash);
  countdown.appendChild(countdownDisplay);
  container.appendChild(countdown);

  /**
   * Ask for permission to use camera
   * @returns {*}
   */
  video.getUserMedia = function () {
    return navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia ||
        navigator.msGetUserMedia ||
        navigator.oGetUserMedia
  };

  /**
   * Get the video element and optionally set dims
   * @param selector
   * @param dims
   * @returns {Element}
   */
  video.get = function (selector, dims) {

    var video = document.querySelector(selector);
    if (dims && dims.length === 2 && typeof dims !== 'string') {
      video.width = dims[0];
      video.height = dims[1];
    }
    return video;
  };

  /**
   * Set the video source when the user grants permission
   * @param stream
   */
  video.stream = function(stream) {
    this.src = window.URL.createObjectURL(stream);
  };

  /**
   * Well crap, they clicked deny video access
   * @param e
   */
  video.error = function(e) {
    throw e;
  };

  /**
   * Simulate camera flash
   */
  video.flash = function(interval){
    flash.className = 'display';
    setTimeout(function(){
      flash.removeAttribute('class');
    }, interval || config.shutterspeed);
  };

  /**
   * Recursive countdown function
   * @param {Number} from countdown from this number
   * @param {function} change broadcast each time the from changes
   * @param {callback} done broadcast when the countdown is over
   * @returns {*}
   */
  video.countdown = function(from, change, done){

    if( from === 0 ){
      countdown.className = 'hidden';
      change(from);
      return done();
    }
    if( typeof from === 'function'){
      change = function(){};
      done = from;
      from = config.countdown_from;
    }
    if( !done && typeof change === 'function' ){
      done = change;
      change = function(){};
    }

    countdown.removeChild(countdownDisplay);
    countdownDisplay = createObjId('h1', 'countdown-display');
    countdown.appendChild(countdownDisplay);
    setTimeout(function(){
      countdownDisplay.className = 'countdown time-'+from;
    }, 30);
    countdownDisplay.innerHTML = from;
    change(from);
    countdown.removeAttribute('class');

    return setTimeout(function(){
      video.countdown(--from, change, done);
    }, 1000);
  };

  video.snapshot = function(v, pause){

    var canvas = document.createElement('canvas');
    canvas.width = config.dims[0];
    canvas.height = config.dims[1];
    var context = canvas.getContext('2d');
    pause && v.pause();
    context.drawImage(v,0,0,config.dims[0], config.dims[1]);
    return canvas;
  };

  exports.video = video;

})(exports || {});