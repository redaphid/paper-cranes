import React, { useState } from 'react';
import { AudioProvider } from './AudioProvider'; // Adjust the import path as needed
import { AudioVisualizer } from './AudioVisualizer'; // Adjust the import path as needed

export const App = () => {
  const initialShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
  `;

  const [shaderSource, setShaderSource] = useState(initialShaderSource);
  const [currentShaderSource, setCurrentShaderSource] = useState(initialShaderSource);

  const handleShaderSourceChange = (event) => {
    setShaderSource(event.target.value);
  };

  const handleUpdateClick = () => {
    setCurrentShaderSource(shaderSource);
  };

  return (
    <AudioProvider>
      <textarea
        value={shaderSource}
        onChange={handleShaderSourceChange}
        rows="10"
        cols="50"
      />
      <button onClick={handleUpdateClick}>Update</button>
      <AudioVisualizer fragmentShaderSource={currentShaderSource} />
    </AudioProvider>
  );
};
