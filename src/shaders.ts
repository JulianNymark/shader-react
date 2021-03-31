export const frag1 = `
#pragma vscode_glsllint_stage : frag //pragma to set STAGE to 'frag'
precision mediump float;

void main() {
    gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);    
} 
`;

export const vert1 = `
#pragma vscode_glsllint_stage : vert
attribute vec3 aVertexPosition;

void main() {
    gl_Position = vec4(aVertexPosition, 1.0); 
}
`;

export const vertCube = `
attribute vec2 aVertexPosition;

uniform vec2 uScalingFactor;
uniform vec2 uRotationVector;

void main() {
  vec2 rotatedPosition = vec2(
    aVertexPosition.x * uRotationVector.y +
          aVertexPosition.y * uRotationVector.x,
    aVertexPosition.y * uRotationVector.y -
          aVertexPosition.x * uRotationVector.x
  );

  gl_Position = vec4(rotatedPosition * uScalingFactor, 0.0, 1.0);
}
`;

export const fragCube = `
#ifdef GL_ES
precision highp float;
#endif

uniform vec4 uGlobalColor;

void main() {
  gl_FragColor = uGlobalColor;
}
`;
