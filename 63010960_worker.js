// worker.js

// List of predefined colors
const colors = ['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#ffff00', '#00ffff'];

let isPaused = false; // Flag to indicate whether the time update is paused
let intervalId; // Interval ID for clearInterval

// Function to update the time and send color information to the main thread
function updateTime() {
  let colorIndex = 0;

  intervalId = setInterval(() => {
    // Check if the time update is paused
    if (isPaused) {
      return;
    }

    const currentTime = new Date().toString(); // Use the `toString` method to get the desired format
    const currentColor = colors[colorIndex];

    // Post a message to the main thread with time and color information
    postMessage({ time: currentTime, color: currentColor, contrastColor: getContrastColor(currentColor) });

    // Increment the color index and cycle back to the beginning if needed
    colorIndex = (colorIndex + 1) % colors.length;
  }, 1000);
}

// Function to pause the time update
function pauseTimeUpdate() {
  isPaused = true;
  clearInterval(intervalId);
}

// Function to resume the time update
function resumeTimeUpdate() {
  isPaused = false;
  updateTime(); // Restart the interval
}

// Function to calculate contrast color based on complement
function getContrastColor(hexColor) {
  // Convert hex color to RGB
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >>  8) & 0xff;
  const b = (rgb >>  0) & 0xff;

  // Calculate the complement color
  const complementColor = '#' + (0xFFFFFF ^ rgb).toString(16).padStart(6, '0');

  return complementColor;
}

// Listen for messages from the main thread
onmessage = function(event) {
  // Handle messages from the main thread
  if (event.data === 'start') {
    // Start updating time when a message is received
    updateTime();
  } else if (event.data === 'pause') {
    // Pause the time when a 'pause' message is received
    pauseTimeUpdate();
  } else if (event.data === 'resume') {
    // Resume the time when a 'resume' message is received
    resumeTimeUpdate();
  }
};
