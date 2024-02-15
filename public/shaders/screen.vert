#version 300 es
precision highp float;

layout(location = 0) in vec2 aPosition;
layout(location = 1) in vec2 aMappedPosition;
out vec2 vMappedPosition;

void main() {
    vMappedPosition = aMappedPosition;
    gl_Position = vec4(aPosition, 0.f, 1.f);
}