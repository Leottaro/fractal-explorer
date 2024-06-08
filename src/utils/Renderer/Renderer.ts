import { colorToVec4, ContextSettings, discardNull } from "@utils/exports";
import fullScreenTexSource from "./fullScreenTexture.wgsl?raw";

export default class Renderer {
    private readonly canvas: HTMLCanvasElement;
    private readonly context: GPUCanvasContext;
    private readonly renderingFormat: GPUTextureFormat;
    private device!: GPUDevice;

    private frameTextures!: [GPUTexture, GPUTexture];

    private fractalSource!: string;
    private fractalPipeline!: GPURenderPipeline;
    private fractalPositions!: GPUBuffer;
    private fractalBindGroup!: GPUBindGroup;

    private computeSource: string | undefined;
    private computePipeline!: GPUComputePipeline;
    private computeBindGroup!: GPUBindGroup;

    private fullScreenTexPipeline!: GPURenderPipeline;
    private fullScreenTexBindGroup!: GPUBindGroup;

    private drawing: boolean;
    public isDrawing = () => this.drawing;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = discardNull(this.canvas.getContext("webgpu"), "WebGPU not supported");
        this.renderingFormat = navigator.gpu.getPreferredCanvasFormat();
        this.drawing = false;
    }

    public async Init(
        settings: ContextSettings,
        fractalPath: string,
        computePath?: string
    ): Promise<void> {
        const adapter = discardNull(
            await navigator.gpu.requestAdapter({ powerPreference: "low-power" }),
            "No adapter found"
        );
        this.device = await adapter.requestDevice();
        this.fractalSource = await fetch(fractalPath).then((res) => res.text());
        this.computeSource = computePath
            ? await fetch(computePath).then((res) => res.text())
            : undefined;
        this.context.configure({
            device: this.device,
            format: this.renderingFormat,
            alphaMode: "premultiplied",
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
        const fractalModule = this.device.createShaderModule({
            code: this.fractalSource,
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
                module: fractalModule,
                entryPoint: "vertexMain",
                buffers: [fractalPositionBufferLayout],
            },
            fragment: {
                module: fractalModule,
                entryPoint: "fragmentMain",
                targets: [{ format: this.renderingFormat }],
            },
            primitive: { topology: "triangle-list" },
            layout: "auto",
        });

        this.fractalPositions = this.createBuffer(
            new Float32Array([-1, 3, 3, -1, -1, -1]), // https://webgpufundamentals.org/webgpu/lessons/webgpu-large-triangle-to-cover-clip-space.html
            GPUBufferUsage.VERTEX
        );

        // compute shader
        if (this.computeSource) {
            const computeModule = this.device.createShaderModule({
                code: this.computeSource,
            });
            this.computePipeline = this.device.createComputePipeline({
                compute: {
                    module: computeModule,
                    entryPoint: "main",
                },
                layout: "auto",
            });
        }

        // fullscreen texture display Shader
        const fullScreenTexModule = this.device.createShaderModule({
            code: fullScreenTexSource,
        });

        this.fullScreenTexPipeline = this.device.createRenderPipeline({
            vertex: {
                module: fullScreenTexModule,
                entryPoint: "vertexMain",
            },
            fragment: {
                module: fullScreenTexModule,
                entryPoint: "fragmentMain",
                targets: [{ format: this.renderingFormat }],
            },
            primitive: { topology: "triangle-list" },
            layout: "auto",
        });
    }

    public updateSettings(settings: ContextSettings): void {
        this.canvas.width = settings.aWidth;
        this.canvas.height = settings.aHeight;

        this.frameTextures = [
            this.device.createTexture({
                size: [this.canvas.width, this.canvas.height],
                format: this.renderingFormat,
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.RENDER_ATTACHMENT,
            }),
            this.device.createTexture({
                size: [this.canvas.width, this.canvas.height],
                format: "rgba8unorm",
                usage:
                    GPUTextureUsage.TEXTURE_BINDING |
                    GPUTextureUsage.COPY_DST |
                    GPUTextureUsage.STORAGE_BINDING,
            }),
        ];

        const sampler = this.device.createSampler({
            addressModeU: "clamp-to-edge",
            addressModeV: "clamp-to-edge",
            magFilter: "linear",
            minFilter: "linear",
        });

        /**
         * i pasted my shaders into https://webgpufundamentals.org/webgpu/lessons/resources/wgsl-offset-computer.html
         * to get the offsets i needed, i then divided everything by 4 (the number of bytes of a float32)
         */
        const uniformsValues = new Float32Array(24 + 4 * settings.uColors.length);
        uniformsValues.set([settings.uTime], 0);
        uniformsValues.set([settings.uSmoothColors ? 1 : 0], 1);
        uniformsValues.set([settings.uMaxIters], 2);
        uniformsValues.set([settings.uColorOffset], 3);
        uniformsValues.set([settings.uAspectRatio], 4);
        uniformsValues.set([settings.uZoom], 5);
        uniformsValues.set([settings.uJuliaC.x, settings.uJuliaC.y], 6);
        uniformsValues.set([settings.uNewtonR.x, settings.uNewtonR.y], 8);
        uniformsValues.set([settings.uNewtonG.x, settings.uNewtonG.y], 10);
        uniformsValues.set([settings.uNewtonB.x, settings.uNewtonB.y], 12);
        uniformsValues.set([settings.uCenter.x, settings.uCenter.y], 14);
        uniformsValues.set([settings.uMouse.x, settings.uMouse.y], 16);
        uniformsValues.set([settings.uFractal.valueOf()], 18);
        uniformsValues.set([settings.uNewtonCChecked], 19);
        uniformsValues.set(colorToVec4(settings.uFillingColor), 20);
        settings.uColors.forEach((color, index) => {
            uniformsValues.set(colorToVec4(color), 24 + 4 * index);
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

        if (this.computeSource) {
            this.computeBindGroup = this.device.createBindGroup({
                layout: this.computePipeline.getBindGroupLayout(0),
                entries: [
                    { binding: 0, resource: sampler },
                    ...this.frameTextures.map((tex, index) => ({
                        binding: index + 1,
                        resource: tex.createView(),
                    })),
                ],
            });
        }

        this.fullScreenTexBindGroup = this.device.createBindGroup({
            layout: this.fullScreenTexPipeline.getBindGroupLayout(0),
            entries: [
                {
                    binding: 0,
                    resource: sampler,
                },
                {
                    binding: 1,
                    resource: this.frameTextures[this.computeBindGroup ? 1 : 0].createView(),
                },
            ],
        });
    }

    public async draw(): Promise<number> {
        if (this.drawing) {
            return -1;
        }
        this.drawing = true;
        const start = performance.now();

        const commandEncoder = this.device.createCommandEncoder();

        // run fractal shader to the fractalTexture
        const fractalPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: this.frameTextures[0].createView(),
                    clearValue: { r: 0, g: 0, b: 0.5, a: 1 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };
        const fractalPass = commandEncoder.beginRenderPass(fractalPassDescriptor);
        fractalPass.setPipeline(this.fractalPipeline);
        fractalPass.setVertexBuffer(0, this.fractalPositions);
        fractalPass.setBindGroup(0, this.fractalBindGroup);
        fractalPass.draw(3);
        fractalPass.end();

        if (this.computeSource) {
            const computePass = commandEncoder.beginComputePass();
            computePass.setPipeline(this.computePipeline);
            computePass.setBindGroup(0, this.computeBindGroup);
            computePass.dispatchWorkgroups(this.canvas.width, this.canvas.height, 1);
            computePass.end();
        }

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
