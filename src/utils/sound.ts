const beepSound = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU' + 'A'.repeat(100));

export const playBeep = () => {
  beepSound.volume = 0.3; // Set a comfortable volume level
  beepSound.currentTime = 0; // Reset sound to start
  beepSound.play().catch(error => {
    console.warn('Audio playback failed:', error);
  });
};