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
  //var countdownDisplay = createObjId('h1', 'countdown-display');
  var flash = createObjId('div', 'camera-flash');

  // put it all in the dom
  container.appendChild(createVideo());
  container.appendChild(flash);
  //countdown.appendChild(countdownDisplay);
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
   * Countdown function to setup and start countdown timer
   * @param {Number} from countdown from this number
   * @param {function} change broadcast each time the from changes
   * @param {callback} done broadcast when the countdown is over
   * @returns {*}
   */
  video.countdown = function(from, change, done){

    if( typeof from === 'function'){
      change = function(){};
      done = from;
      from = config.countdown_from;
    }
    if( !done && typeof change === 'function' ){
      done = change;
      change = function(){};
    }

    countdown.removeAttribute('class');
    var count = buildNumbers(from);
    // force the browser to paint the first number.
    var firstn = count[count.length-1];
    firstn.style.transform = 'scaleX(1) scaleY(1)';
    setTimeout(function(){firstn.style.transform = ''},1);

    timer(count, from, change, done);
  };
  /**
   * Build the count display
   * @returns {Array}
   */
  function buildNumbers(from){
    var count = [];
    for( let i = 1; i < from + 1; i++){
      var display = createObjId('h1', 'countdown-display');
      countdown.appendChild(display);
      display.innerHTML = i;
      count.push(display);
    }
    return count;
  }
  /**
   * Recursive countdown function
   * @param {Array} domnumbers the actual dom elements for countdown
   * @param {Number} from countdown from this number
   * @param {function} change broadcast each time the from changes
   * @param {callback} done broadcast when the countdown is over
   * @returns {*}
   */
  function timer(domnumbers, from, change, done){

    if( from === 0 ){
      domnumbers.className = 'hidden';
      change(from);
      while (countdown.firstChild) {
        countdown.removeChild(countdown.firstChild);
      }
      return done();
    }

    var countdownDisplay = domnumbers.pop();
    countdownDisplay.className = 'countdown time-'+from;
    change(from);
    return setTimeout(function(){
      timer(domnumbers, --from, change, done);
    }, 1000);
  }

  /**
   * Takes a snapshot (single frame) from canvas
   * @param v
   * @param pause
   * @returns {Element}
   */
  video.snapshot = function(v, pause){

    var canvas = document.createElement('canvas');
    canvas.width = config.dims[0];
    canvas.height = config.dims[1];
    var context = canvas.getContext('2d');
    pause && v.pause();
    context.drawImage(v,0,0,config.dims[0], config.dims[1]);
    return canvas;
  };

  function process(func){
    //Get the pixel values
    var pix = this.ctx.getImageData(0, 0, this.width, this.height);

    //Loop through the pixels
    for (var x = 0; x < this.width; x++) {
      for (var y = 0; y < this.height; y++) {
        var i = (y * this.width + x) * 4;
        var r = pix.data[i],
            g = pix.data[i + 1],
            b = pix.data[i + 2],
            a = pix.data[i + 3];
        var ret = func(r, g, b, a, x, y);
        pix.data[i] = ret[0];
        pix.data[i + 1] = ret[1];
        pix.data[i + 2] = ret[2];
        pix.data[i + 3] = ret[3];
      }
    }

    //Put the image back to the canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.putImageData(pix, 0, 0);
    return this;
  }

  video.whiteBalance = function(temp) {
    var color = this.colorTempToRGB(temp);
    return this.process(function(r, g, b, a) {
      var nr = r * (255 / color.r);
      var ng = g * (255 / color.g);
      var nb = b * (255 / color.b);
      return [nr, ng, nb, a];
    });
  }

  exports.video = video;

})(exports || {});