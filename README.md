# Photobooth Javascript

Best practices lib for photobooth.

 - stream webcam to video element
 - render screenshots to canvas in memory
 - countdown timer optimized performance
 - easy to configure from config.js
   - Set video dimensions (automatically changes flash point)
   - Set countdown from timer
   - Enable or disable the countdown for demo purposes
   - Set the "shutter" speed (flash when picture is taken)
   - Set rear or front facing camera

### Dev/testing

checkout the repo and

```
npm install
# optional if grunt is not already installed
# npm install grunt grunt-cli -g
```

Run the grunt task. Runs a dev server to port 9001 for testing

```
grunt
```

Open http://localhost:9001

# TODO

 - add filters
 - more modular