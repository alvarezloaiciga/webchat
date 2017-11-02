import assets from 'assets';
import quiqOptions from 'Common/QuiqOptions';

// Load alert sound--must be done here, not inside alert function
// $FlowIssue
const canPlayMp3 = ['probably', 'maybe'].includes(new Audio().canPlayType('audio/mp3'));
const alertFile = canPlayMp3 ? assets.alertSound : assets.alertSoundWav;

// $FlowIssue
const alertSound = new Audio(alertFile);

/**
 * Plays a sound notification. Designed for demoing sound to user.
 */
export const playSound = () => {
  if (quiqOptions.playNotificationSoundOnNewMessage) {
    alertSound.play();
  }
};
