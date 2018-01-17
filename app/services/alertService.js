import assets from 'assets';
import QuiqChatClient from 'quiq-chat';

// Load alert sound--must be done here, not inside alert function
// $FlowIssue
let audioElement;

try {
  audioElement = document.createElement('audio');

  // We have seen `canPlayType` be undefined in production. Unsure as to why. Fall back to wav if we can't test mp3.
  const canPlayMp3 =
    typeof audioElement.canPlayType === 'function'
      ? ['probably', 'maybe'].includes(audioElement.canPlayType('audio/mp3'))
      : false;
  const alertFile = canPlayMp3 ? assets.alertSound : assets.alertSoundWav;

  // $FlowIssue
  audioElement.src = alertFile;
} catch (e) {
  audioElement = undefined;
  QuiqChatClient._logToSentry('error', e.message, {exception: e});
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
