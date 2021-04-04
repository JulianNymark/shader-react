// for typing the tagged template literals (extension will match on them for syntax hl)
const vert = (v: any) => v;
const frag = (v: any) => v;

// export const frag1 = frag`
// #pragma vscode_glsllint_stage : frag //pragma to set STAGE to 'frag'
// precision mediump float;

// void main() {
//     gl_FragColor = vec4(0.5, 1.0, 1.0, 1.0);
// }
// `;

// export const vert1 = vert`
// attribute vec3 aVertexPosition;

// void main() {
//     gl_Position = vec4(aVertexPosition, 1.0);
// }
// `;

export const vertCube = vert`
attribute vec2 aVertexPosition;

void main() {
  gl_Position = vec4(aVertexPosition, 0.0, 1.0);
}
`;

export const fragCube = frag`
#pragma vscode_glsllint_stage : vert
#define PI 3.14159265358979323846

#ifdef GL_ES
precision highp float;
#endif

uniform vec4 u_globalColor;
uniform float u_time;
uniform vec2 u_resolution;

float random (vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

vec2 truchetPattern(in vec2 _st, in float _index){
  _index = fract(((_index-0.5)*2.0));
  if (_index > 0.75) {
      _st = vec2(1.0) - _st;
  } else if (_index > 0.5) {
      _st = vec2(1.0-_st.x,_st.y);
  } else if (_index > 0.25) {
      _st = 1.0-vec2(1.0-_st.x,_st.y);
  }
  return _st;
}

void main() {
  float time = u_time / 1000.0;

  vec2 st = gl_FragCoord.xy/u_resolution.xy;
  st *= 10.0;

  st = (st-vec2(5.0))*(abs(sin(time*0.2))*5.);
  st.x += time*3.0;

  vec2 ipos = floor(st);
  vec2 fpos = fract(st);

  vec2 tile = truchetPattern(fpos, random(ipos));

  float color = 0.0;

  // Maze
  color = smoothstep(tile.x-0.3,tile.x,tile.y)-
          smoothstep(tile.x,tile.x+0.3,tile.y);

  // some ant conditions?!
  
  // vec4 color = vec4(cos(time + (st.x * 10.0 * PI)), sin(time + (10.0 * PI * st.y)), cos(time * PI * 10.0) + sin(time), 1.0);
  // color = color * vec4(1.0 - cos(PI * 0.5), cos(PI * 0.5), sin(PI * 0.5), 1.0 - sin(PI * 0.5));
  gl_FragColor = vec4(vec3(color), 1.0);
}
`;
