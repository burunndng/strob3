/**
 * Audio playback for binaural beats presets
 * Maps session presets to corresponding WAV files
 */

(function() {
  const PRESET_AUDIO_MAP = {
    'alpha-peak': '/api/lumina/assets/alpha.wav',
    'hypnagogic': '/api/lumina/assets/theta.wav',
    'deep-alpha': '/api/lumina/assets/alpha.wav',
    'music-amplifier': '/api/lumina/assets/eternal-love.wav',
    'gamma-40': '/api/lumina/assets/theta.wav',
    'extended': '/api/lumina/assets/alpha.wav',
  };

  let currentAudio = null;

  /**
   * Play audio for the given preset
   * @param {string} presetName - Name of the preset
   */
  function playPresetAudio(presetName) {
    if (!presetName) return;

    const audioPath = PRESET_AUDIO_MAP[presetName];
    if (!audioPath) return;

    // Stop any currently playing audio
    stopAudio();

    // Create and play audio
    currentAudio = new Audio(audioPath);
    currentAudio.loop = true;
    currentAudio.volume = 0.5;

    currentAudio.play().catch(error => {
      console.warn(`Could not autoplay audio for preset ${presetName}:`, error);
    });
  }

  /**
   * Stop any currently playing audio
   */
  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }
  }

  /**
   * Initialize audio playback when a session starts
   */
  function initializeAudioPlayback() {
    // Listen for session start events
    document.addEventListener('sessionStart', (event) => {
      const preset = event.detail?.preset || event.detail?.presetName;
      if (preset) {
        playPresetAudio(preset);
      }
    });

    // Also check for preset selection in the app
    const originalSetAttribute = Element.prototype.setAttribute;
    Element.prototype.setAttribute = function(name, value) {
      originalSetAttribute.call(this, name, value);
      if (name === 'data-preset' || name === 'data-session-preset') {
        playPresetAudio(value);
      }
    };
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAudioPlayback);
  } else {
    initializeAudioPlayback();
  }

  // Expose functions globally if needed
  window.audioPlayback = {
    play: playPresetAudio,
    stop: stopAudio,
  };
})();
