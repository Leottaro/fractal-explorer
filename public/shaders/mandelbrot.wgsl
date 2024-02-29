const OneOverlogOfTwo: f32 = 1 / log(2);

struct Settings {
    uTime: f32,
    uSmoothColors: f32,
    uMaxIters: f32,
    uColorOffset: f32,
    uAspectRatio: f32,
    uZoom: f32,
    uCenter: vec2f,
    uMouse: vec2f,
    uFillingColor: vec3f,
    uColors: array<vec3f>,
};
@group(0) @binding(0) var<storage, read> settings: Settings;

struct VertexOut {
    @builtin(position) position: vec4f,
    @location(0) mappedPosition: vec2f,
}
@vertex
fn vertexMain(@location(0) position: vec2f) -> VertexOut {
    var output: VertexOut;
    output.position = vec4f(position, 0., 1.);
    output.mappedPosition = vec2f(position.x * settings.uAspectRatio, position.y) / settings.uZoom + settings.uCenter;
    return output;
}

fn smoothIters(i: f32, z: vec2f) -> f32 {
    let log_zn: f32 = log(z.x * z.x + z.y * z.y) / 2;
    return i + 1 - log(log_zn * OneOverlogOfTwo) * OneOverlogOfTwo;
}

fn getColor(iterations: f32) -> vec3f {
    if iterations >= settings.uMaxIters {
        return settings.uFillingColor;
    }
    let newI: f32 = (1 + cos(log2(iterations + 10) + settings.uColorOffset)) * 2.5;
    let col1: u32 = u32(newI);
    let col2: u32 = (col1 + 1) % 5;
    let percent: f32 = newI - f32(col1);
    return settings.uColors[col1] + percent * (settings.uColors[col2] - settings.uColors[col1]);
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    let pointPos: vec2f = fragData.mappedPosition;

    // skip if the point is in the 1st cardioid
    let y2: f32 = pointPos.y * pointPos.y;
    let q: f32 = pow(pointPos.x - 0.25, 2) + y2;
    if q * (q + (pointPos.x - 0.25)) <= 0.25 * y2 {
        return vec4f(settings.uFillingColor, 1);
    }

    // skip if the point is in the 2nd cardioid
    if pow(pointPos.x + 1, 2) + y2 < 0.0625 {
        return vec4f(settings.uFillingColor, 1);
    }

    // Usual algorithm
    var z: vec2f = pointPos;
    var i: f32 = 0;
    for (i = 0; i <= settings.uMaxIters; i = i + 1) {
        z = vec2f(z.x * z.x - z.y * z.y, 2 * z.x * z.y) + pointPos;
        if z.x == pointPos.x && z.y == pointPos.y { // periodicity check
            return vec4f(settings.uFillingColor, 1);
        }
        if length(z) > 16. {
            break;
        }
    }
    if settings.uSmoothColors == 1 && i < settings.uMaxIters {
        i = smoothIters(i, z);
    }

    return vec4(getColor(i), 1.);
}