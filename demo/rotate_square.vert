attribute vec2 aVertexPosition;
attribute vec4 aVertexColor;

uniform mat4 uMVMatrix;
uniform mat4 uPMatrix;
uniform float time;

varying lowp vec4 vColor;

const float PI = 3.14159265359;
mat2 rotate2d(float _angle){
    return mat2(
        cos(_angle),-sin(_angle),
        sin(_angle),cos(_angle));
}

void main(void) {
  vec2 pos = rotate2d(time * PI * 2.0) * aVertexPosition;
  gl_Position = uPMatrix * uMVMatrix * vec4(pos, 1.0, 1.0);
  vColor = aVertexColor * vec4(pos, 1.0, 1.0);
}