var exports = {};

/**
 * write config to css to keep overlays and shutterspeeds consitently configured in 1 place
 */
document.write(`
<style>
:root {
  --photbooth-camera-width: ${config.dims[0]}px;
  --photbooth-camera-height: ${config.dims[1]}px;
  --photbooth-camera-flash: opacity ${config.shutterspeed}ms ease-in-out
}
</style>
`);
