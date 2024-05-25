const OneOverlogOfTwo: f32 = 1 / log(2);

struct Settings {
    uTime: f32,
    uSmoothColors: f32,
    uMaxIters: f32,
    uColorOffset: f32,
    uAspectRatio: f32,
    uZoom: f32,
    uJuliaC: vec2f,
    uNewtonC1: vec2f,
    uNewtonC2: vec2f,
    uNewtonC3: vec2f,
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

// Since we will work with complex numbers, we need to define some operations
fn add(a: vec2f, b: vec2f) -> vec2f {
    return vec2f(a.x + b.x, a.y + b.y);
}
fn add3(a: vec2f, b: vec2f, c: vec2f) -> vec2f {
    return vec2f(a.x + b.x + c.x, a.y + b.y + c.y);
}

fn sub(a: vec2f, b: vec2f) -> vec2f {
    return vec2f(a.x - b.x, a.y - b.y);
}
fn sub3(a: vec2f, b: vec2f, c: vec2f) -> vec2f {
    return vec2f(a.x - b.x - c.x, a.y - b.y - c.y);
}

fn mult(a: vec2f, b: vec2f) -> vec2f {
    return vec2f(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
}
fn mult3(a: vec2f, b: vec2f, c: vec2f) -> vec2f {
    return mult(a, mult(b, c));
}

fn div(a: vec2f, b: vec2f) -> vec2f {
    let d: f32 = b.x * b.x + b.y * b.y;
    return vec2f((a.x * b.x + a.y * b.y) / d, (a.y * b.x - a.x * b.y) / d);
}
fn div3(a: vec2f, b: vec2f, c: vec2f) -> vec2f {
    return div(a, mult(b, c));
}

// Julia and Mandelbrot visual functions

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

// Julia and Mandelbrot

fn Julia(point: vec2f, constant: vec2f) -> vec4f {
    // Usual algorithm
    var z: vec2f = point;
    var i: f32 = 0;
    while i < settings.uMaxIters && length(z) < 16. {
        z = add(mult(z, z), constant);
        if z.x == point.x && z.y == point.y { // periodicity check
            return vec4f(settings.uFillingColor, 1);
        }
        if length(z) > 16. {
            break;
        }
        i = i + 1;
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

// Newton 
fn Newton(point: vec2f, r1: vec2f, r2: vec2f, r3: vec2f) -> vec4f {
    // did the logic there https://www.desmos.com/calculator/abb3n0sehd
    // we have 3 roots: r1, r2, r3
    // f(x) = (x-r1)(x-r2)(x-r3)
    // f'(x) = g(x) = (x-r1)(x-r2) + (x-r2)(x-r3) + (x-r1)(x-r3)
    // h(x) is the tangent to f(x) at x
    // the new x is x - f(x)/g(x)

    var dC1: f32;
    var dC2: f32;
    var dC3: f32;
    var num: vec2f;
    var denom: vec2f;

    var z: vec2f = point;
    var i: f32 = 0;
    var dMin: f32 = 1;
    while dMin > 0.001 && i < settings.uMaxIters {
        num = mult3(sub(z, r1), sub(z, r2), sub(z, r3));
        denom = add3(mult(sub(z, r1), sub(z, r2)), mult(sub(z, r2), sub(z, r3)), mult(sub(z, r1), sub(z, r3)));
        z = sub(z, div(num, denom));
        dC1 = length(z - settings.uNewtonC1);
        dC2 = length(z - settings.uNewtonC2);
        dC3 = length(z - settings.uNewtonC3);
        dMin = min(dC1, min(dC2, dC3));
        i = i + 1;
    }

    if dMin > 0.001 {
        return vec4f(settings.uFillingColor, 1);
    }

    var color: vec3f;
    var dist: f32;
    if dC1 < dC2 && dC1 < dC3 {
        color = vec3f(1, 0, 0);
        dist = dot(z - r1, z - r1);
    } else if dC2 < dC1 && dC2 < dC3 {
        color = vec3f(0, 1, 0);
        dist = dot(z - r2, z - r2);
    } else {
        color = vec3f(0, 0, 1);
        dist = dot(z - r3, z - r3);
    }
    if settings.uSmoothColors == 1 {
        color *= 0.75 + 0.25 * cos(0.25 * (i - log2(log(dist) / log(0.001))));
    }
    return vec4f(color, 1);
}

@fragment
fn fragmentMain(fragData: VertexOut) -> @location(0) vec4f {
    let pointPos: vec2f = fragData.mappedPosition;
    if settings.uFractal == 0 {
        return Julia(pointPos, settings.uJuliaC);
    } else if settings.uFractal == 1 {
        return Mandelbrot(pointPos);
    } else if settings.uFractal == 2 {
        return Newton(pointPos, settings.uNewtonC1, settings.uNewtonC2, settings.uNewtonC3);
    } else {
        return vec4f(settings.uFillingColor, 1);
    }
}