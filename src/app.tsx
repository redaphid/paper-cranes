import React from 'react';
import { AudioProvider } from './AudioProvider'; // Adjust the import path as needed
import {AudioVisualizer} from './AudioVisualizer'; // Adjust the import path as needed

export const App = () => {
  return (
    <AudioProvider>
      <AudioVisualizer />
    </AudioProvider>
  );
}
