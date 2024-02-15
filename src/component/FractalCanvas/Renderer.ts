import { ContextSettings } from "../../context/AppContext";

interface bufferProps {
    layoutID: number;
    dataType: number;
    vecSize: number;
    data: number[];
}

export class Renderer {
    private canvas: HTMLCanvasElement;
    private gl: WebGL2RenderingContext;
    private program: WebGLProgram;
    private settings: ContextSettings;

    constructor(canvasElement: HTMLCanvasElement, settings: ContextSettings) {
        this.settings = settings;
        this.canvas = canvasElement;
        this.canvas.width = settings.aWidth;
        this.canvas.height = settings.aHeight;
        const tempGl = this.canvas.getContext("webgl2");
        if (!tempGl) {
            throw new Error("Your browser doesn't support WebGL2");
        }
        this.gl = tempGl;
        this.gl.viewport(0, 0, settings.aWidth, settings.aHeight);
        this.program = this.gl.createProgram()!;
    }

    async Init(vertexPath: string, fragmentPath: string) {
        const [vertexSource, fragmentSource] = await this.fetchShaders(vertexPath, fragmentPath);
        const vertexShader = this.createShader(this.gl.VERTEX_SHADER, vertexSource);
        const fragmentShader = this.createShader(this.gl.FRAGMENT_SHADER, fragmentSource);

        this.createProgram(vertexShader, fragmentShader);
        this.gl.useProgram(this.program);

        // aPosition
        this.createArrayBuffer({
            layoutID: 0,
            dataType: this.gl.FLOAT,
            vecSize: 2,
            data: [-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1],
        });
    }

    private async fetchShaders(vertexPath: string, fragmentPath: string) {
        const vertexSource = await fetch(vertexPath).then((res) => res.text());
        const fragmentSource = await fetch(fragmentPath).then((res) => res.text());
        return [vertexSource, fragmentSource];
    }

    private createShader(type: number, source: string): WebGLShader {
        const shader = this.gl.createShader(type)!;
        this.gl.shaderSource(shader, source);
        this.gl.compileShader(shader);

        if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
            console.error(this.gl.getShaderInfoLog(shader));
        }

        return shader;
    }

    private createProgram(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
        const program = this.gl.createProgram()!;
        this.gl.attachShader(this.program, vertexShader);
        this.gl.attachShader(this.program, fragmentShader);

        this.gl.linkProgram(this.program);

        if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
            console.error(this.gl.getProgramInfoLog(this.program));
        }
        return program;
    }

    private createArrayBuffer({ layoutID, dataType, vecSize, data }: bufferProps): WebGLBuffer {
        const buffer = this.gl.createBuffer()!;
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(data), this.gl.STATIC_DRAW);
        this.gl.vertexAttribPointer(layoutID, vecSize, dataType, false, 0, 0);
        this.gl.enableVertexAttribArray(layoutID);
        return buffer;
    }

    public updateSettings(settings: ContextSettings) {
        this.settings = settings;

        this.canvas.width = this.settings.aWidth;
        this.canvas.height = this.settings.aHeight;
        this.gl.viewport(0, 0, this.settings.aWidth, this.settings.aHeight);

        // aMappedPosition
        this.createArrayBuffer({
            layoutID: 1,
            dataType: this.gl.FLOAT,
            vecSize: 2,
            data: [-1, -1, -1, 1, 1, 1, -1, -1, 1, -1, 1, 1].map((coord, index) => {
                return index % 2 == 0
                    ? (coord * this.settings.uAspectRatio) / this.settings.uZoom +
                          this.settings.uCenter.x
                    : coord / this.settings.uZoom + this.settings.uCenter.y;
            }),
        });

        const uColors = this.gl.getUniformLocation(this.program, "uColors"); // TODO:
        this.gl.uniform3fv(
            uColors,
            [0, 7, 100, 32, 107, 203, 237, 255, 255, 255, 170, 0, 0, 2, 0].map(
                (color) => color / 255
            )
        );

        const uFillingColor = this.gl.getUniformLocation(this.program, "uFillingColor"); // TODO:
        this.gl.uniform3f(uFillingColor, 0, 0, 0);

        const uMaxIters = this.gl.getUniformLocation(this.program, "uMaxIters");
        this.gl.uniform1f(uMaxIters, this.settings.uMaxIters);

        const uColorOffset = this.gl.getUniformLocation(this.program, "uColorOffset");
        this.gl.uniform1f(uColorOffset, this.settings.uColorOffset);

        const uSmoothColors = this.gl.getUniformLocation(this.program, "uSmoothColors");
        this.gl.uniform1ui(uSmoothColors, this.settings.uSmoothColors ? 1 : 0);

        const uMouse = this.gl.getUniformLocation(this.program, "uMouse");
        this.gl.uniform2f(uMouse, this.settings.uMouse.x, this.settings.uMouse.y);

        const uTime = this.gl.getUniformLocation(this.program, "uTime");
        this.gl.uniform1f(uTime, this.settings.uTime);
    }

    public draw(): void {
        this.gl.clearColor(1, 0, 0, 1);
        this.gl.clear(this.gl.DEPTH_BUFFER_BIT | this.gl.COLOR_BUFFER_BIT);
        this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);
    }
}
