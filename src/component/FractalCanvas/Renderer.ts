import { ContextSettings } from "../../context/AppContext";

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
    private shaderSoucre!: string;
    private context: GPUCanvasContext;
    private device!: GPUDevice;
    private pipeline!: GPURenderPipeline;
    private positionBuffer!: GPUBuffer;
    private bindGroup!: GPUBindGroup;

    private drawing: boolean;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.context = discardNull(this.canvas.getContext("webgpu"), "WebGPU not supported");
        this.drawing = false;
    }

    public async Init(shaderPath: string): Promise<void> {
        const adapter = discardNull(
            await navigator.gpu.requestAdapter({ powerPreference: "low-power" }),
            "No adapter found"
        );
        this.device = await adapter.requestDevice();
        this.shaderSoucre = await fetch(shaderPath).then((res) => res.text());
        this.context.configure({
            device: this.device,
            format: navigator.gpu.getPreferredCanvasFormat(),
        });
        this.prepareModel();
        this.positionBuffer = this.createBuffer(
            new Float32Array([-1, 1, 1, -1, -1, -1, -1, 1, 1, -1, 1, 1]),
            GPUBufferUsage.VERTEX
        );
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
        const shaderModule = this.device.createShaderModule({ code: this.shaderSoucre });

        const positionBufferLayout: GPUVertexBufferLayout = {
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

        const vertexState: GPUVertexState = {
            module: shaderModule,
            entryPoint: "vertexMain",
            buffers: [positionBufferLayout],
        };

        const fragmentState: GPUFragmentState = {
            module: shaderModule,
            entryPoint: "fragmentMain",
            targets: [{ format: navigator.gpu.getPreferredCanvasFormat() }],
        };

        this.pipeline = this.device.createRenderPipeline({
            vertex: vertexState,
            fragment: fragmentState,
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

        const uniformBuffer = this.createBuffer(uniformsValues, GPUBufferUsage.STORAGE);
        this.bindGroup = this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
        });
    }

    public async draw(): Promise<void> {
        if (this.drawing) {
            return;
        }
        this.drawing = true;
        const commandEncoder = this.device.createCommandEncoder();
        const textureView = this.context.getCurrentTexture().createView();
        const rendererPassDescriptor: GPURenderPassDescriptor = {
            colorAttachments: [
                {
                    view: textureView,
                    clearValue: { r: 0.1, g: 0.1, b: 0.1, a: 1 },
                    loadOp: "clear",
                    storeOp: "store",
                },
            ],
        };
        const passEncorder = commandEncoder.beginRenderPass(rendererPassDescriptor);
        passEncorder.setPipeline(this.pipeline);

        passEncorder.setVertexBuffer(0, this.positionBuffer);
        passEncorder.setBindGroup(0, this.bindGroup);

        passEncorder.draw(6);
        passEncorder.end();
        this.device.queue.submit([commandEncoder.finish()]);
        await this.device.queue.onSubmittedWorkDone();
        this.drawing = false;
    }
}
