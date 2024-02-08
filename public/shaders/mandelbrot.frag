#version 300 es
precision highp float;

const float PI = 3.14159265358979f;
const float logOf2 = log(2.f);

uniform vec2 uMouse;
uniform float uTime;
uniform vec3 uColors[5];
uniform vec3 uFillingColor;
uniform float uMaxIters;
uniform float uGlow;
uniform bool uSmoothColors;


in vec2 vPosition;
out vec4 fragColor;

vec2 complexMul(vec2 a, vec2 b) { 
    return vec2(a.x*b.x-a.y*b.y, a.x*b.y+a.y*b.x);
}

float smoothIters(float i, vec2 z) {
    float log_zn = log(z.x*z.x + z.y*z.y) / 2.;
    return i + 1. - log(log_zn / logOf2) / logOf2;
}

vec3 getColor(float iterations) {
    if (iterations >= uMaxIters) {
        return uFillingColor;
    }
    float newI = (1.+cos(log2(iterations+10.))) * float(uColors.length()/2);
    int col1 = int(newI);
    int col2 = (col1 + 1) % uColors.length();
    float percent = newI - float(col1);
    return uColors[col1] + percent * (uColors[col2] - uColors[col1]);
}

void main() {
    // skip if the point is in the 1st cardioid
    float y2 = vPosition.y * vPosition.y;
    float q = pow(vPosition.x - 0.25, 2.) + y2;
    if (q * (q + (vPosition.x - 0.25)) <= 0.25*y2) {
        fragColor = vec4(uFillingColor, 1.);
        return;
    }
    
    // skip if the point is in the 2nd cardioid
    if (pow(vPosition.x + 1., 2.) + y2 < 0.0625) {
        fragColor = vec4(uFillingColor, 1.);
        return;
    }

    // Usual algorithm
    vec2 z = vPosition;
    float i;
    for(i = 0.; i <= uMaxIters; i++) {
        z = complexMul(z, z) + vPosition;
        if (z == vPosition) { // periodicity check
            fragColor = vec4(uFillingColor, 1.);
            return;
        }
        if(length(z) > 16.) {
            break;
        }
    }
    if(uSmoothColors && i < uMaxIters) {
        i = smoothIters(i, z);
    }
    vec3 color;
    color = getColor(i);
    // color = vec3(i/uMaxIters);
    fragColor = vec4(color, 1.f);
}