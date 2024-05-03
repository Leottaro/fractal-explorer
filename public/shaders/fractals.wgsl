const OneOverlogOfTwo: f32 = 1 / log(2);

struct Settings {
    uTime: f32,
    uSmoothColors: f32,
    uMaxIters: f32,
    uColorOffset: f32,
    uAspectRatio: f32,
    uZoom: f32,
    uJuliaC: vec2f,
    uCenter: vec2f,
    uMouse: vec2f,
    uFillingColor: vec3f,
    uFractal: f32,
    uColors: array<vec4f>, // uColors are sorted by t
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
    let t: f32 = (1 + cos(log2(iterations + 10) + settings.uColorOffset)) / 2;
    if t <= settings.uColors[0].w {
        return settings.uColors[0].rgb;
    }
    let colorsLength: u32 = arrayLength(&settings.uColors);
    if t >= settings.uColors[colorsLength - 1].w {
        return settings.uColors[colorsLength - 1].rgb;
    }

    var col2: u32 = 1;
    while col2 < colorsLength && settings.uColors[col2].w < t {
        col2 = col2 + 1;
    }
    let col1 = col2 - 1;

    let color1 = settings.uColors[col1].rgb;
    let t1 = settings.uColors[col1].w;
    let color2 = settings.uColors[col2].rgb;
    let t2 = settings.uColors[col2].w;

    let finalT: f32 = (t - t1) / (t2 - t1);
    return color1 + finalT * (color2 - color1);
}

fn Julia(point: vec2f, constant: vec2f) -> vec4f {
    // Usual algorithm
    var z: vec2f = point;
    var i: f32 = 0;
    for (i = 0; i <= settings.uMaxIters; i = i + 1) {
        z = vec2f(z.x * z.x - z.y * z.y, 2 * z.x * z.y) + constant;
        if z.x == point.x && z.y == point.y { // periodicity check
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

fn Mandelbrot(point: vec2f) -> vec4f {
    // skip if the point is in the 1st cardioid
    let y2: f32 = point.y * point.y;
    let q: f32 = pow(point.x - 0.25, 2) + y2;
    if q * (q + (point.x - 0.25)) <= 0.25 * y2 {
        return vec4f(settings.uFillingColor, 1);
    }

    // skip if the point is in the 2nd cardioid
    if pow(point.x + 1, 2) + y2 < 0.0625 {
        return vec4f(settings.uFillingColor, 1);
    }

    return Julia(point, point);
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    let pointPos: vec2f = fragData.mappedPosition;
    if settings.uFractal == 0 {
        return Julia(pointPos, settings.uJuliaC);
    } else if settings.uFractal == 1 {
        return Mandelbrot(pointPos);
    } else {
        return vec4f(settings.uFillingColor, 1);
    }
}