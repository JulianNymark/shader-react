// for typing the tagged template literals (extension will match on them for syntax hl)
const vert = (v: any) => v;
const frag = (v: any) => v;

export const frag1 = frag`
#pragma vscode_glsllint_stage : frag //pragma to set STAGE to 'frag'
precision mediump float;

void main() {
    gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);    
} 
`;

export const vert1 = vert`
#pragma vscode_glsllint_stage : vert
attribute vec3 aVertexPosition;

void main() {
    gl_Position = vec4(aVertexPosition, 1.0); 
}
`;

export const vertCube = vert`
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

export const fragCube = frag`
#pragma vscode_glsllint_stage : vert

#ifdef GL_ES
precision highp float;
#endif

uniform vec4 u_globalColor;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
  float time = u_time / 1000.0;
  vec2 st = gl_FragCoord.xy/(0.5 * u_resolution);
  vec4 color = vec4(cos(time + st.x), sin(time + st.y), 1.0, 1.0);
  gl_FragColor = color;
}
`;
