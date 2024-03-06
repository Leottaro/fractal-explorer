import { ContextSettings } from "../../context/AppContext";
import fullScreenTexSource from "./fullScreenTexture.wgsl?raw";

function discardNull(element: any | null | undefined, errorMessage: string) {
    if (!element) {
        console.error(errorMessage);
        alert(errorMessage);
        throw new Error(errorMessage);
    }
    return element;
}

export default class Renderer {
    private canvas: HTMLCanvasElement;
    private context: GPUCanvasContext;
    private device!: GPUDevice;

    private fractalShaderSoucre!: string;
    private fractalPipeline!: GPURenderPipeline;
    private fractalPositionBuffer!: GPUBuffer;
    private fractalBindGroup!: GPUBindGroup;

    private fractalTexture!: GPUTexture;

    private fullScreenTexPipeline!: GPURenderPipeline;
    private fullScreenTexBindGroup!: GPUBindGroup;

    private drawing: boolean;
    public isDrawing = () => this.drawing;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = discardNull(this.canvas.getContext("webgpu"), "WebGPU not supported");
        this.drawing = false;
    }

    public async Init(
        settings: ContextSettings,
        fractalShaderPath: string,
        computePath: string
    ): Promise<void> {
        const adapter = discardNull(
            await navigator.gpu.requestAdapter({ powerPreference: "low-power" }),
            "No adapter found"
        );
        this.device = await adapter.requestDevice();
        this.fractalShaderSoucre = await fetch(fractalShaderPath).then((res) => res.text());
        this.context.configure({
            device: this.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
        });
        this.prepareModel();
        this.updateSettings(settings);
    }

    private createBuffer(data: Float32Array | Float64Array, usage: number): GPUBuffer {
        const buffer = this.device.createBuffer({
            size: data.byteLength,
            usage: usage | GPUBufferUsage.COPY_DST,
            mappedAtCreation: true,
        });
        new Float32Array(buffer.getMappedRange()).set(data);
        buffer.unmap();
        return buffer;
    }

    private prepareModel() {
        // Fractal shader
        const fractalShaderModule = this.device.createShaderModule({
            code: this.fractalShaderSoucre,
        });

        const fractalPositionBufferLayout: GPUVertexBufferLayout = {
            arrayStride: 2 * Float32Array.BYTES_PER_ELEMENT,
            attributes: [
                {
                    shaderLocation: 0,
                    offset: 0,
                    format: "float32x2",
                },
            ],
            stepMode: "vertex",
        };

        this.fractalPipeline = this.device.createRenderPipeline({
            vertex: {
                module: fractalShaderModule,
                entryPoint: "vertexMain",
                buffers: [fractalPositionBufferLayout],
            },
            fragment: {
                module: fractalShaderModule,
                entryPoint: "fragmentMain",
                targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
            },
            primitive: { topology: "triangle-list" },
            layout: "auto",
        });

        this.fractalPositionBuffer = this.createBuffer(
            new Float32Array([-1, 3, 3, -1, -1, -1]), // https://webgpufundamentals.org/webgpu/lessons/webgpu-large-triangle-to-cover-clip-space.html
            GPUBufferUsage.VERTEX
        );

        // fullscreen texture display Shader
        const fullScreenTexShaderModule = this.device.createShaderModule({
            code: fullScreenTexSource,
        });

        this.fullScreenTexPipeline = this.device.createRenderPipeline({
            vertex: {
                module: fullScreenTexShaderModule,
                entryPoint: "vertexMain",
            },
            fragment: {
                module: fullScreenTexShaderModule,
                entryPoint: "fragmentMain",
                targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
            },
            primitive: { topology: "triangle-list" },
            layout: "auto",
        });
    }

    public updateSettings(settings: ContextSettings): void {
        this.canvas.width = settings.aWidth;
        this.canvas.height = settings.aHeight;

        /**
         * i pasted my shaders into https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
         * to get the offsets i needed, i then divided everything by 4 (the number of bytes of a float32)
         */
        const uniformsValues = new Float32Array(36);
        uniformsValues.set([settings.uTime], 0);
        uniformsValues.set([settings.uSmoothColors ? 1 : 0], 1);
        uniformsValues.set([settings.uMaxIters], 2);
        uniformsValues.set([settings.uColorOffset], 3);
        uniformsValues.set([settings.uAspectRatio], 4);
        uniformsValues.set([settings.uZoom], 5);
        uniformsValues.set([settings.uCenter.x, settings.uCenter.y], 6);
        uniformsValues.set([settings.uMouse.x, settings.uMouse.y], 8);
        uniformsValues.set(settings.uFillingColor, 12);
        settings.uColors.forEach((color, index) => {
            uniformsValues.set(color, 16 + 4 * index);
        });

        this.fractalBindGroup = this.device.createBindGroup({
            layout: this.fractalPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: { buffer: this.createBuffer(uniformsValues, GPUBufferUsage.STORAGE) },
                },
            ],
        });

        this.fractalTexture = this.device.createTexture({
            size: [this.canvas.width, this.canvas.height],
            format: navigator.gpu.getPreferredCanvasFormat(),
            usage:
                GPUTextureUsage.TEXTURE_BINDING |
                GPUTextureUsage.COPY_DST |
                GPUTextureUsage.RENDER_ATTACHMENT,
        });

        this.fullScreenTexBindGroup = this.device.createBindGroup({
            layout: this.fullScreenTexPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: this.device.createSampler({
                        addressModeU: "clamp-to-edge",
                        addressModeV: "clamp-to-edge",
                        magFilter: "linear",
                        minFilter: "linear",
                    }),
                },
                { binding: 1, resource: this.fractalTexture.createView() },
            ],
        });
    }

    public async draw(): Promise<number | undefined> {
        if (this.drawing) {
            return;
        }
        this.drawing = true;
        const start = performance.now();

        const commandEncoder = this.device.createCommandEncoder();

        // run fractal shader to the fractalTexture
        const fractalPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.fractalTexture.createView(),
                    clearValue: { r: 0, g: 0, b: 0.5, a: 1 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };
        const fractalPass = commandEncoder.beginRenderPass(fractalPassDescriptor);
        fractalPass.setPipeline(this.fractalPipeline);
        fractalPass.setVertexBuffer(0, this.fractalPositionBuffer);
        fractalPass.setBindGroup(0, this.fractalBindGroup);
        fractalPass.draw(3);
        fractalPass.end();

        // TODO: compute shader for anti aliasing

        // display fractalTexture to canvas
        const fullScreenTexPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.context.getCurrentTexture().createView(),
                    clearValue: { r: 0.5, g: 0, b: 0, a: 1 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };
        const fullScreenTexPass = commandEncoder.beginRenderPass(fullScreenTexPassDescriptor);
        fullScreenTexPass.setPipeline(this.fullScreenTexPipeline);
        fullScreenTexPass.setBindGroup(0, this.fullScreenTexBindGroup);
        fullScreenTexPass.draw(6);
        fullScreenTexPass.end();

        this.device.queue.submit([commandEncoder.finish()]);
        await this.device.queue.onSubmittedWorkDone();

        const deltaTime = performance.now() - start;
        this.drawing = false;
        return deltaTime;
    }
}
