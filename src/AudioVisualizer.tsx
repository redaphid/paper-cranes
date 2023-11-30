import React, { useContext } from 'react';
import { AudioProviderContext } from './AudioProvider'; // Adjust the import path as needed

export const AudioVisualizer = () => {
  const audioContext = useContext(AudioProviderContext);
  if (!audioContext) {
    return <div>Loading...</div>;
  }

  // Access audio features from the context
  const { audioFeatures } = audioContext;

  // Extract the RMS value
  const rmsValue = audioFeatures ? audioFeatures.rms : 'No data';

  return (
    <div>
      <p>RMS: {rmsValue}</p>
    </div>
  );
};

export default AudioVisualizer;
