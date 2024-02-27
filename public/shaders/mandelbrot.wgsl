const colorsLength: i32 = 5;
const OneOverlogOfTwo: f32 = 1 / log(2);

struct Uniforms {
    uTime: f32,
    uSmoothColors: f32,
    uMaxIters: f32,
    uColorOffset: f32,
    uAspectRatio: f32,
    uZoom: f32,
    uCenter: vec2f,
    uMouse: vec2f,
    uFillingColor: vec3f,
    uColors: array<vec3f, colorsLength>,
};
@group(0) @binding(0) var<uniform> uniforms: Uniforms;

struct VertexOut {
    @builtin(position) position: vec4f,
    @location(0) mappedPosition: vec2f,
}
@vertex
fn vertexMain(@location(0) position: vec2f) -> VertexOut {
    var output: VertexOut;

    output.position = vec4f(position, 0., 1.);

    output.mappedPosition = position;
    output.mappedPosition.x *= uniforms.uAspectRatio;
    output.mappedPosition /= uniforms.uZoom;
    output.mappedPosition += uniforms.uCenter;

    return output;
}

fn complexMul(a: vec2f, b: vec2f) -> vec2f {
    return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}

fn smoothIters(i: f32, z: vec2f) -> f32 {
    var log_zn: f32 = log(z.x * z.x + z.y * z.y) / 2;
    return i + 1 - log(log_zn * OneOverlogOfTwo) * OneOverlogOfTwo;
}

fn getColor(iterations: f32) -> vec3f {
    if iterations >= uniforms.uMaxIters {
        return uniforms.uFillingColor;
    }
    var newI: f32 = (1 + cos(log2(iterations + 10) + uniforms.uColorOffset)) * f32(colorsLength) / 2;
    var col1: i32 = i32(newI);
    var col2: i32 = (col1 + 1) % colorsLength;
    var percent: f32 = newI - f32(col1);
    return uniforms.uColors[col1] + percent * (uniforms.uColors[col2] - uniforms.uColors[col1]);
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    // skip if the point is in the 1st cardioid
    var y2: f32 = fragData.mappedPosition.y * fragData.mappedPosition.y;
    var q: f32 = pow(fragData.mappedPosition.x - 0.25, 2) + y2;
    if q * (q + (fragData.mappedPosition.x - 0.25)) <= 0.25 * y2 {
        return vec4f(uniforms.uFillingColor, 1);
    }

    // skip if the point is in the 2nd cardioid
    if pow(fragData.mappedPosition.x + 1, 2) + y2 < 0.0625 {
        return vec4f(uniforms.uFillingColor, 1);
    }

    // Usual algorithm
    var z: vec2f = fragData.mappedPosition;
    var i: f32 = 0;
    for (i = 0; i <= uniforms.uMaxIters; i = i + 1) {
        z = complexMul(z, z) + fragData.mappedPosition;
        if z.x == fragData.mappedPosition.x && z.y == fragData.mappedPosition.y { // periodicity check
            return vec4f(uniforms.uFillingColor, 1);
        }
        if length(z) > 16. {
            break;
        }
    }
    if uniforms.uSmoothColors == 1 && i < uniforms.uMaxIters {
        i = smoothIters(i, z);
    }

    return vec4(getColor(i), 1.);
    // return vec4(vec3(i / uniforms.uMaxIters), 1.);
}