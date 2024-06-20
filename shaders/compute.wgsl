@group(0) @binding(0) var samp: sampler;
@group(0) @binding(1) var inputTex: texture_2d<f32>;
@group(0) @binding(2) var outputTex: texture_storage_2d<rgba8unorm, write>;

fn sample(uv: vec2u, offsetX: f32, offsetY: f32) -> vec4f {
    let samplePos: vec2f = vec2f(f32(uv.x) + offsetX, f32(uv.y) + offsetY) / vec2f(textureDimensions(outputTex) + 1);
    return textureSampleLevel(inputTex, samp, samplePos, 0.);
}

@compute @workgroup_size(1)
fn main(@builtin(global_invocation_id) GlobalInvocationID: vec3u) {
    let writingPos: vec2u = GlobalInvocationID.xy;
    let sampleColor: vec4f = sample(writingPos, 0, 0);
    textureStore(outputTex, writingPos, sampleColor);
}