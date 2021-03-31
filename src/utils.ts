import { fragCube, vertCube } from "./shaders";

interface Shader {
  type:
    | WebGLRenderingContextBase["VERTEX_SHADER"]
    | WebGLRenderingContextBase["FRAGMENT_SHADER"];
  id: string;
  code: string;
}

interface Dimension {
  width: number;
  height: number;
}

const getCanvas = (glCanvas: HTMLCanvasElement) => {
  const gl = glCanvas.getContext("webgl");

  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    throw new Error('unable to get canvas WebGlRenderingContext');
  }
  return gl;
}

export const rotatingCube = (glCanvas: HTMLCanvasElement) => {
  const gl = getCanvas(glCanvas);

  if (!gl) {
    alert(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const shaderSet = [
    {
      type: gl.VERTEX_SHADER,
      id: "vertex-shader",
      code: vertCube,
    },
    {
      type: gl.FRAGMENT_SHADER,
      id: "fragment-shader",
      code: fragCube,
    },
  ];

  const shaderProgram = buildShaderProgram(gl, shaderSet);
  if (!shaderProgram) {
    console.error("Error building shader program");
    return;
  }

  animateScene(glCanvas, shaderProgram, 0, 0);
};

const buildShaderProgram = (
  gl: WebGLRenderingContext,
  shaderInfo: Shader[]
) => {
  let program = gl.createProgram();

  if (!program) {
    console.error("Error creating shader program");
    return;
  }

  shaderInfo.forEach(function (shaderDescriptor) {
    let shader = compileShader(gl, shaderDescriptor);

    if (program && shader) {
      gl.attachShader(program, shader);
    } else {
      console.error("Error attaching shader to program");
    }
  });

  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Error linking shader program:");
    console.error(gl.getProgramInfoLog(program));
  }

  return program;
};

const compileShader = (
  gl: WebGLRenderingContext,
  { id, type, code }: Shader
) => {
  let shader = gl.createShader(type);

  if (!shader) {
    console.error("Error creating shader");
    return;
  }

  gl.shaderSource(shader, code);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.log(
      `Error compiling ${
        type === gl.VERTEX_SHADER ? "vertex" : "fragment"
      } shader:`
    );
    console.log(gl.getShaderInfoLog(shader));
  }
  return shader;
};

const animateScene = (
  glCanvas: HTMLCanvasElement,
  shaderProgram: WebGLProgram,
  previousTime: number,
  currentAngle: number,
) => {
  const gl = getCanvas(glCanvas);

  const degreesPerSecond = 30;
  const aspectRatio = glCanvas.width / glCanvas.height;
  const dimension = { width: glCanvas.width, height: glCanvas.height };
  const currentRotation = [0, 1];
  const currentScale = [1.0, aspectRatio];

  const vertexArray = new Float32Array([
    -0.5,
    0.5,
    0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    0.5,
    0.5,
    -0.5,
    -0.5,
    -0.5,
  ]);

  const vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);

  const vertexNumComponents = 2;
  const vertexCount = vertexArray.length / vertexNumComponents;

  gl.viewport(0, 0, dimension.width, dimension.height);
  gl.clearColor(0.8, 0.9, 1.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  let radians = (currentAngle * Math.PI) / 180.0;
  currentRotation[0] = Math.sin(radians);
  currentRotation[1] = Math.cos(radians);

  gl.useProgram(shaderProgram);

  const uScalingFactor = gl.getUniformLocation(shaderProgram, "uScalingFactor");
  const uGlobalColor = gl.getUniformLocation(shaderProgram, "uGlobalColor");
  const uRotationVector = gl.getUniformLocation(shaderProgram, "uRotationVector");

  gl.uniform2fv(uScalingFactor, currentScale);
  gl.uniform2fv(uRotationVector, currentRotation);
  gl.uniform4fv(uGlobalColor, [0.1, 0.7, 0.2, 1.0]);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);

  const aVertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");

  gl.enableVertexAttribArray(aVertexPosition);
  gl.vertexAttribPointer(
    aVertexPosition,
    vertexNumComponents,
    gl.FLOAT,
    false,
    0,
    0
  );

  gl.drawArrays(gl.TRIANGLES, 0, vertexCount);

  window.requestAnimationFrame(function (currentTime) {
    let deltaAngle = ((currentTime - previousTime) / 1000.0) * degreesPerSecond;

    currentAngle = (currentAngle + deltaAngle) % 360;

    previousTime = currentTime;
    animateScene(glCanvas, shaderProgram, previousTime, currentAngle);
  });
};
