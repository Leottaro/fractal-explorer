import { Attributes, Uniforms, ContextSettings } from "../../context/AppContext";

var canvas: HTMLCanvasElement;
var gl: WebGL2RenderingContext;
var program: WebGLProgram;
var vertexShaderSource: string;
var vertexShader: WebGLShader;
var fragmentShaderSource: string;
var fragmentShader: WebGLShader;
var compiled = false;

export const Init = async (canvasElement: HTMLCanvasElement, settings: ContextSettings) => {
    compiled = false;
    canvas = canvasElement;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const tempGl = canvas.getContext("webgl2");
    if (!tempGl) {
        throw new Error("Your browser doesn't support WebGL2");
    }
    gl = tempGl;

    gl.viewport(0, 0, canvas.width, canvas.height);
    const tempProgram = gl.createProgram();
    if (!tempProgram) {
        throw new Error("Unable to create shaders Program");
    }
    program = tempProgram;

    const tempVertexShader = gl.createShader(gl.VERTEX_SHADER);
    const tempFragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!tempVertexShader || !tempFragmentShader) {
        throw new Error("Unable to create Shaders");
    }
    vertexShader = tempVertexShader;
    fragmentShader = tempFragmentShader;

    await fetchShader().then(() => {
        buildShader();
        if (compiled) {
            buildAttributes(settings);
            buidlUniforms(settings);
            draw();
        }
    });
};

export const fetchShader = async () => {
    vertexShaderSource = await fetch("shaders/screen.vert").then((res) => res.text());
    fragmentShaderSource = await fetch("shaders/mandelbrot.frag").then((res) => res.text());
};

export const buildShader = () => {
    compiled = false;
    const tempShaders = gl.getAttachedShaders(program);
    if (tempShaders) tempShaders.forEach((shader) => gl.detachShader(program, shader));

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);

    gl.shaderSource(fragmentShader, fragmentShaderSource);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);

    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
        gl.useProgram(program);
        compiled = true;
    } else {
        console.error(gl.getShaderInfoLog(vertexShader));
        console.error(gl.getShaderInfoLog(fragmentShader));
    }
};

export const buildAttributes = (attributes: Attributes) => {
    if (!compiled) return;
    canvas.width = attributes.aWidth;
    canvas.height = attributes.aHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aPositionLoc = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPositionLoc);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1]),
        gl.DYNAMIC_DRAW
    );

    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);
};

export const buidlUniforms = (uniforms: Uniforms) => {
    if (!compiled) return;

    // for vertex shader

    const uAspectRatio = gl.getUniformLocation(program, "uAspectRatio");
    gl.uniform1f(uAspectRatio, uniforms.uAspectRatio);

    const uCenter = gl.getUniformLocation(program, "uCenter");
    gl.uniform2f(uCenter, uniforms.uCenter.x, uniforms.uCenter.y);

    const uZoom = gl.getUniformLocation(program, "uZoom");
    gl.uniform1f(uZoom, uniforms.uZoom);

    // for fragment shader

    const uColors = gl.getUniformLocation(program, "uColors"); // TODO:
    gl.uniform3fv(
        uColors,
        [0, 7, 100, 32, 107, 203, 237, 255, 255, 255, 170, 0, 0, 2, 0].map((coord) => coord / 255)
    );

    const uFillingColor = gl.getUniformLocation(program, "uFillingColor"); // TODO:
    gl.uniform3f(uFillingColor, 0, 0, 0);

    const uMaxIters = gl.getUniformLocation(program, "uMaxIters");
    gl.uniform1f(uMaxIters, uniforms.uMaxIters);

    const uColorOffset = gl.getUniformLocation(program, "uColorOffset");
    gl.uniform1f(uColorOffset, uniforms.uColorOffset);

    const uSmoothColors = gl.getUniformLocation(program, "uSmoothColors");
    gl.uniform1ui(uSmoothColors, uniforms.uSmoothColors ? 1 : 0);

    const uMouse = gl.getUniformLocation(program, "uMouse");
    gl.uniform2f(uMouse, uniforms.uMouse.x, uniforms.uMouse.y);

    const uTime = gl.getUniformLocation(program, "uTime");
    gl.uniform1f(uTime, uniforms.uTime);
};

export const draw = () => {
    if (!compiled) return;
    gl.drawArrays(gl.TRIANGLES, 0, 6);
};
