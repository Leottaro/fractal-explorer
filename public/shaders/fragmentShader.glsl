#version 300 es
precision highp float;

const float PI = 3.14159265358979f;
const float logOf2 = log(2.f);

uniform vec2 uMouse;
uniform float uTime;
uniform vec3 uColors[2];
uniform float uMaxIters;
uniform float uGlow;
uniform bool uSmoothColors;

in vec2 vPosition;
out vec4 fragColor;

vec3 julia(vec2 z, vec2 c) {
    for(float i = 0.f; i < uMaxIters; i++) {
        z = vec2(z.x * z.x - z.y * z.y, 2.f * z.x * z.y) + c;
        if(length(z) >= 4.f)
            return vec3(i, z);
    }
    return vec3(uMaxIters, z);
}
vec3 mandelbrot(vec2 c) {
    return julia(vec2(0.f), c);
}

float posLog(float f) {
    return max(1.f, log(f));
}
float smoothIters(float i, vec2 z) {
    return i + 1.f - posLog(posLog(dot(z, z))) / logOf2;
}

vec3 getColor(float p) {
    if(p < 0.f)
        p = 0.f;
    else if(p > 1.f)
        p = 1.f;
    p = pow(p, 1.f / uGlow); // TODO: 0.01 <= uGlow <= 5
    return uColors[0] * (1.f - p) + uColors[1] * p;
}

void main() {
    vec3 result;
    // result=julia(vPosition,vec2(-.4,-.59));
    // result=julia(vPosition,vec2(1.)*uMouse);
    result=julia(vPosition,vec2(cos(uTime),sin(uTime)));
    // result=julia(vPosition,vec2(cos(uTime)*uMouse.x,sin(uTime)*uMouse.y));
    // result = mandelbrot(vPosition);

    float iterations;
    if(uSmoothColors) {
        iterations = smoothIters(result.x, result.yz) / uMaxIters;
    } else {
        iterations = result.x / uMaxIters;
    }

    fragColor = vec4(getColor(iterations), 1.f);
}