struct VertexOut {
    @builtin(position) position: vec4f,
    @location(0) fragUV: vec2f,
}

const pos = array(
    vec2f(-1, -1),
    vec2f(-1, 1),
    vec2f(1, 1),
    vec2f(-1, -1),
    vec2f(1, -1),
    vec2f(1, 1)
);
    const uv = array(
    vec2f(0, 1),
    vec2f(0, 0),
    vec2f(1, 0),
    vec2f(0, 1),
    vec2f(1, 1),
    vec2f(1, 0)
);

@vertex
fn vertexMain(@builtin(vertex_index) vertexIndex: u32) -> VertexOut {
    var output: VertexOut;
    output.position = vec4f(pos[vertexIndex], 0., 1.);
    output.fragUV = uv[vertexIndex];
    return output;
}

@group(0) @binding(0) var mySampler: sampler;
@group(0) @binding(1) var fractalTexture: texture_2d<f32>;

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    return textureSample(fractalTexture, mySampler, fragData.fragUV);
}