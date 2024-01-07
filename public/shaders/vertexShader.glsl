#version 300 es
precision highp float;

uniform float uAspectRatio;
uniform vec2 uCenter;
uniform float uZoom;

in vec2 aPosition;
out vec2 vPosition;

vec2 mappedPosition() {
    vec2 position = aPosition;
    position.x *= uAspectRatio;
    position /= uZoom;
    position += uCenter;
    return position;
}

void main() {
    vPosition = mappedPosition();
    gl_Position = vec4(aPosition, 0.f, 1.f);
}