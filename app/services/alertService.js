import assets from 'assets';

// Load alert sound--must be done here, not inside alert function
// $FlowIssue
let audioElement;

try {
  audioElement = document.createElement('audio');

  const canPlayMp3 = ['probably', 'maybe'].includes(audioElement.canPlayType('audio/mp3'));
  const alertFile = canPlayMp3 ? assets.alertSound : assets.alertSoundWav;

  // $FlowIssue
  audioElement.src = alertFile;
} catch (e) {
  audioElement = undefined;
}

/**
 * Plays a sound notification. Designed for demoing sound to user.
 */
// eslint-disable-next-line import/prefer-default-export
export const playSound = () => {
  if (audioElement) {
    audioElement.play();
  }
};
