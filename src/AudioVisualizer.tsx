import React, { useContext, useEffect } from 'react';
import { AudioProviderContext } from './AudioProvider'; // Adjust the import path as needed

export const AudioVisualizer = () => {
  const audioContext = useContext(AudioProviderContext);

  useEffect(() => {
    if (audioContext) {
      // Example usage: audioContext.setAudioSource(yourAudioSource);
      // You can also access audioFeatures: audioContext.audioFeatures;
    }
  }, [audioContext]);

  return (
    <div>
      {/* Render your component UI based on the context */}
      <p>Audio Consumer Component</p>
    </div>
  );
};
