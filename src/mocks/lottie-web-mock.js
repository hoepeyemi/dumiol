// Mock implementation of lottie-web for server-side rendering
const lottieWebMock = {
  loadAnimation: () => ({
    destroy: () => {},
  }),
  destroy: () => {},
  setSpeed: () => {},
  setDirection: () => {},
  play: () => {},
  pause: () => {},
  stop: () => {},
  goToAndStop: () => {},
  goToAndPlay: () => {},
  setSubframe: () => {},
  getDuration: () => 0,
  // Add any other methods that might be used
};

module.exports = lottieWebMock; 