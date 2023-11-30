import React from 'react';
import { AudioProvider } from './AudioProvider'; // Adjust the import path as needed
import {AudioVisualizer} from './AudioVisualizer'; // Adjust the import path as needed

export const App = () => {
    const fragmentShader = `
      precision mediump float;
      uniform vec4 uColor;
      void main() {
          gl_FragColor = uColor;
      }
    `;
    return (
    <AudioProvider>
         <AudioVisualizer fragmentShaderSource={fragmentShader} />
    </AudioProvider>
    );
  };
