import React, { useRef, useEffect, useContext } from 'react';
import { AudioProviderContext } from './AudioProvider';

export const AudioVisualizer = () => {
  const canvasRef = useRef(null);
  const shaderProgramRef = useRef(null);
  const glRef = useRef(null); // To store the WebGL context
  const audioContext = useContext(AudioProviderContext);

  // Vertex Shader
  const vertexShaderSource = `
    attribute vec4 aVertexPosition;
    void main() {
        gl_Position = aVertexPosition;
    }
  `;

  // Fragment Shader
  const fragmentShaderSource = `
    precision mediump float;
    uniform vec4 uColor;
    void main() {
        gl_FragColor = uColor;
    }
  `;

  useEffect(() => {
    if (!canvasRef.current || glRef.current) {
      return;
    }

    const gl = canvasRef.current.getContext('webgl');
    glRef.current = gl;

    if (!gl) {
      console.error('Unable to initialize WebGL. Your browser may not support it.');
      return;
    }
   // Function to create a shader
   const loadShader = (type, source) => {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      return null;
    }
    return shader;
  };

  // Initialize shaders
  const vertexShader = loadShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = loadShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
     const shaderProgram = gl.createProgram();
     shaderProgramRef.current = shaderProgram;
     gl.attachShader(shaderProgram, vertexShader);
     gl.attachShader(shaderProgram, fragmentShader);
     gl.linkProgram(shaderProgram);
       // Check if shader program linked successfully
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
        return;
      }

       // Use the shader program
    gl.useProgram(shaderProgram);

    // Set up the rectangle coordinates (two triangles)
    const vertices = [
        -1.0,  1.0,
        -1.0, -1.0,
         1.0,  1.0,
         1.0, -1.0,
    ];
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // Get the position attribute location from the shader program
    const positionAttribLocation = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.vertexAttribPointer(positionAttribLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionAttribLocation);



    return () => {
      // Cleanup WebGL resources
      if (shaderProgramRef.current) {
        gl.deleteProgram(shaderProgramRef.current);
        shaderProgramRef.current = null;
      }
      gl.deleteShader(fragmentShader);
      gl.deleteShader(vertexShader);
      gl.deleteBuffer(vertexBuffer);
    };
  }, []); // Empty dependency array to run only once

  useEffect(() => {
    if (!audioContext || !shaderProgramRef.current) {
      return;
    }

    const gl = glRef.current;
    const shaderProgram = shaderProgramRef.current;
    const colorUniformLocation = gl.getUniformLocation(shaderProgram, 'uColor');
      // Rendering loop
      const render = () => {
        if (!shaderProgramRef.current) return;

        // Clear the canvas
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Set the color based on the RMS value
        const rms = audioContext.audioFeatures?.rms || 0;
        const color = [rms, 0.0, 0.0, 1.0]; // Red color with varying intensity
        gl.uniform4fv(colorUniformLocation, color);

        // Draw the rectangle
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    return () => {
      // Cleanup for rendering loop
    };
  }, [audioContext]); // Dependency on audioContext for updates


  return (
    <div>
      <canvas ref={canvasRef} width="640" height="480"></canvas>
    </div>
  );
};

export default AudioVisualizer;
